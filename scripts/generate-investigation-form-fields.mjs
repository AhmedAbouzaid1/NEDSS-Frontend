import * as ng from '@angular/compiler';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const formsDir = path.join(root, 'src/app/features/home/investigation/complete-investigation');
const routingFile = path.join(root, 'src/app/features/home/home.routing.ts');
const outFile = path.join(root, 'src/app/features/home/reports/investigation-forms-report/investigation-form-fields.generated.ts');

const FIELD_TAGS = new Set(['input', 'select', 'textarea', 'p-dropdown', 'p-multiselect', 'ng-multiselect-dropdown', 'app-date-field', 'p-calendar', 'mat-select']);
const SKIP_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'hidden', 'file', 'image']);
const MAJOR_SECTION_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'legend']);
const SKIP_TEXT_TAGS = new Set(['button', 'small', 'option', 'script', 'style']);
const NOISE_KEY = /(REQUIRED|INVALID|ERROR|VALIDATION|SAVE|CANCEL|BACK|PAGE_TITLE|DOWNLOAD|PRINT|ADD_ROW|DELETE|REMOVE|عرض السجلات|^سجل$|^#$)/i;

function readRouterMap() {
  const src = fs.readFileSync(routingFile, 'utf8');
  const imports = {};
  for (const m of src.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/investigation\/complete-investigation\/([^/']+)\//g)) {
    imports[m[1]] = m[2];
  }
  const start = src.indexOf("path: 'compelete-investigation'");
  const block = src.slice(start, src.indexOf("path: 'epidemiological-thresholds'", start));
  const routers = {};
  for (const m of block.matchAll(/path:\s*'([^']+)'\s*,\s*component:\s*(\w+)/g)) {
    if (imports[m[2]]) routers[m[1]] = imports[m[2]];
  }
  return routers;
}

function readConstantRefs(tsFile) {
  if (!fs.existsSync(tsFile)) return {};
  const src = fs.readFileSync(tsFile, 'utf8');
  const constants = new Set();
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*'[^']*core\/constants'/g)) {
    m[1].split(',').map(s => s.trim()).filter(Boolean).forEach(s => constants.add(s.split(/\s+as\s+/).pop()));
  }
  const refs = {};
  for (const m of src.matchAll(/^\s*(?:public\s+|private\s+|readonly\s+)*([A-Za-z_]\w*)\s*(?::[^=;\n]+)?=\s*([A-Za-z_]\w*)\s*;/gm)) {
    if (constants.has(m[2])) refs[m[1]] = m[2];
  }
  return refs;
}

function readLocalOptions(tsFile) {
  if (!tsFile || !fs.existsSync(tsFile)) return {};
  const src = fs.readFileSync(tsFile, 'utf8');
  const lists = {};
  for (const m of src.matchAll(/^\s*(?:public\s+|private\s+|readonly\s+)*([A-Za-z_]\w*)\s*(?::[^=;\n]+)?=\s*\[([\s\S]*?)\]\s*;/gm)) {
    const options = {};
    for (const o of m[2].matchAll(/\{([^{}]*)\}/g)) {
      const value = o[1].match(/\b(?:id|value)\s*:\s*(?:'([^']*)'|"([^"]*)"|(-?\d+(?:\.\d+)?)|(true|false))/);
      const text = o[1].match(/\b(?:arabicName|label|name)\s*:\s*(?:'([^']*)'|"([^"]*)")/);
      if (!value || !text) continue;
      const key = value[1] ?? value[2] ?? value[3] ?? value[4];
      const label = cleanText(text[1] ?? text[2]);
      if (label) options[key] = [label];
    }
    if (Object.keys(options).length) lists[m[1]] = options;
  }
  return lists;
}

function readJsonAliases(tsFile) {
  if (!tsFile || !fs.existsSync(tsFile)) return {};
  const src = fs.readFileSync(tsFile, 'utf8');
  const aliases = {};
  const skip = new Set(['this', 'payload', 'value', 'raw', 'data', 'form', 'getRawValue', 'controls']);
  for (const m of src.matchAll(/\.(\w+Json)\s*=\s*JSON\.stringify\(\s*([\w.?!]+)/g)) {
    const segments = m[2].split('.').map(x => x.replace(/[?!]/g, '')).filter(x => x && !skip.has(x));
    const target = segments.pop();
    if (target && target.toLowerCase() !== m[1].replace(/Json$/, '').toLowerCase()) {
      (aliases[target] = aliases[target] || new Set()).add(m[1]);
    }
  }
  return aliases;
}

function evalExpr(ast, scope) {
  if (!ast) return undefined;
  if (ast instanceof ng.ASTWithSource) return evalExpr(ast.ast, scope);
  if (ng.ParenthesizedExpression && ast instanceof ng.ParenthesizedExpression) return evalExpr(ast.expression, scope);
  if (ast instanceof ng.LiteralPrimitive) return ast.value;
  if (ast instanceof ng.Binary && ast.operation === '+') {
    const l = evalExpr(ast.left, scope), r = evalExpr(ast.right, scope);
    return l === undefined || r === undefined ? undefined : l + r;
  }
  if (ast instanceof ng.PropertyRead && ast.receiver instanceof ng.ImplicitReceiver) return scope?.[ast.name];
  if (ast instanceof ng.Call && ast.receiver instanceof ng.PropertyRead && !ast.args.length) {
    const target = evalExpr(ast.receiver.receiver, scope);
    if (typeof target !== 'string') return undefined;
    if (ast.receiver.name === 'toUpperCase') return target.toUpperCase();
    if (ast.receiver.name === 'toLowerCase') return target.toLowerCase();
  }
  return undefined;
}

function scopedTokens(nodes, scope) {
  const tokens = [];
  const walk = (list) => list.forEach(n => {
    if (n instanceof ng.TmplAstText) {
      const t = cleanText(n.value);
      if (t) tokens.push(t);
    } else if (n instanceof ng.TmplAstBoundText) {
      const ast = n.value instanceof ng.ASTWithSource ? n.value.ast : n.value;
      (ast instanceof ng.Interpolation ? ast.expressions : [ast]).forEach(e => {
        if (e instanceof ng.BindingPipe && e.name === 'translate') {
          const key = evalExpr(e.exp, scope);
          if (typeof key === 'string' && key.trim()) tokens.push(key.trim());
        }
      });
    } else if (n instanceof ng.TmplAstElement) {
      walk(n.children);
    }
  });
  walk(nodes);
  return tokens.filter(t => !NOISE_KEY.test(t));
}

function multiCheckboxKey(el) {
  const checked = input(el, 'checked');
  const ast = checked?.value instanceof ng.ASTWithSource ? checked.value.ast : checked?.value;
  if (!(ast instanceof ng.Call) || !(ast.receiver instanceof ng.PropertyRead) || ast.receiver.name !== 'isSelected') return undefined;
  const first = ast.args[0];
  return first instanceof ng.LiteralPrimitive && typeof first.value === 'string' ? first.value : undefined;
}

function literalForOf(tpl) {
  const bound = (tpl.templateAttrs || []).find(a => a.name === 'ngForOf');
  const ast = bound?.value instanceof ng.ASTWithSource ? bound.value.ast : bound?.value;
  if (!(ast instanceof ng.LiteralArray)) return undefined;
  const values = ast.expressions.map(e => (e instanceof ng.LiteralPrimitive ? e.value : undefined));
  if (values.some(v => v === undefined)) return undefined;
  const variable = (tpl.variables || []).find(v => v.value === '$implicit');
  return variable ? { name: variable.name, values } : undefined;
}

function translateKeysOf(ast, out) {
  if (!ast) return;
  if (ast instanceof ng.ASTWithSource) return translateKeysOf(ast.ast, out);
  if (ast instanceof ng.Interpolation) return ast.expressions.forEach(e => translateKeysOf(e, out));
  if (ast instanceof ng.BindingPipe) {
    if (ast.name === 'translate' && ast.exp instanceof ng.LiteralPrimitive && typeof ast.exp.value === 'string') out.push(ast.exp.value.trim());
    return;
  }
  if (ast instanceof ng.Conditional) {
    translateKeysOf(ast.trueExp, out);
    return;
  }
}

function cleanText(value) {
  const text = (value || '').replace(/\s+/g, ' ').replace(/[:*]+\s*$/, '').trim();
  return /[\p{L}]/u.test(text) ? text : '';
}

function directTokens(node) {
  const tokens = [];
  for (const child of node.children || []) {
    if (child instanceof ng.TmplAstText) {
      const t = cleanText(child.value);
      if (t) tokens.push(t);
    } else if (child instanceof ng.TmplAstBoundText) {
      translateKeysOf(child.value, tokens);
    }
  }
  return tokens.filter(t => !NOISE_KEY.test(t));
}

function deepTokens(node, stopAtFields = true, includeButtons = false) {
  const tokens = [...directTokens(node)];
  for (const child of node.children || []) {
    if (child instanceof ng.TmplAstElement || child instanceof ng.TmplAstTemplate) {
      if (stopAtFields && child instanceof ng.TmplAstElement && isField(child)) continue;
      const childTag = child instanceof ng.TmplAstElement ? child.name.toLowerCase() : '';
      if (SKIP_TEXT_TAGS.has(childTag) && !(includeButtons && childTag === 'button')) continue;
      tokens.push(...deepTokens(child, stopAtFields, includeButtons));
    }
  }
  return tokens;
}

function attr(el, name) {
  const a = el.attributes.find(x => x.name.toLowerCase() === name.toLowerCase());
  return a ? a.value : undefined;
}

function input(el, name) {
  return el.inputs.find(x => x.name.toLowerCase() === name.toLowerCase());
}

function literalOf(boundAttr) {
  if (!boundAttr) return undefined;
  const ast = boundAttr.value instanceof ng.ASTWithSource ? boundAttr.value.ast : boundAttr.value;
  if (ast instanceof ng.LiteralPrimitive) return ast.value;
  return undefined;
}

function isField(el) {
  const tag = el.name.toLowerCase();
  const type = (attr(el, 'type') || '').toLowerCase();
  if (tag === 'input' && SKIP_INPUT_TYPES.has(type)) return false;
  return FIELD_TAGS.has(tag) || !!attr(el, 'formControlName') || !!input(el, 'formControlName') || !!input(el, 'ngModel');
}

function fieldKey(el) {
  const fcn = attr(el, 'formControlName') ?? literalOf(input(el, 'formControlName'));
  if (fcn) return String(fcn);
  const model = input(el, 'ngModel');
  if (model) {
    const source = (model.value.source || '').replace(/[?!]/g, '').trim();
    const segment = source.split('.').pop();
    if (segment && /^[A-Za-z_]\w*$/.test(segment)) return segment;
  }
  return attr(el, 'name') || undefined;
}

function classOf(el) {
  return ` ${(attr(el, 'class') || '').toLowerCase()} `;
}

function isTitleElement(el) {
  const cls = classOf(el);
  return cls.includes(' title ') || cls.includes(' titles ') || cls.includes(' card-header ') || cls.includes(' section-title ') || cls.includes(' section-bar ');
}

function templateForOf(tpl) {
  const bound = (tpl.templateAttrs || []).find(a => a.name === 'ngForOf');
  if (!bound) return undefined;
  const src = (bound.value?.source || '').trim();
  const m = src.match(/of\s+([A-Za-z_]\w*)/) || src.match(/^([A-Za-z_]\w*)/);
  return m ? m[1] : undefined;
}

function extractForm(htmlFile, constantRefs, localOptions = {}, jsonAliases = {}) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const parsed = ng.parseTemplate(html, htmlFile, { preserveWhitespaces: false });
  const fields = new Map();
  const state = { major: [], minor: [], label: [] };

  const ensure = (key) => {
    if (!fields.has(key)) {
      fields.set(key, {
        key,
        label: state.label.length ? state.label.slice() : state.minor.slice(),
        section: [...state.major, ...state.minor],
      });
    }
    return fields.get(key);
  };

  const addOption = (field, value, tokens) => {
    if (value === undefined || value === null || !tokens.length) return;
    field.options = field.options || {};
    const k = String(value);
    if (!field.options[k]) field.options[k] = tokens;
  };

  const collectSelectOptions = (field, el) => {
    const walkOptions = (nodes) => {
      for (const n of nodes) {
        if (n instanceof ng.TmplAstTemplate) {
          const ref = templateForOf(n);
          if (ref && constantRefs[ref]) field.optionsRef = constantRefs[ref];
          else if (ref && localOptions[ref]) field.options = { ...localOptions[ref], ...(field.options || {}) };
          else walkOptions(n.children);
        } else if (n instanceof ng.TmplAstElement) {
          if (n.name.toLowerCase() === 'option') {
            const value = attr(n, 'value') ?? literalOf(input(n, 'value')) ?? literalOf(input(n, 'ngValue'));
            addOption(field, value, deepTokens(n, false));
          } else {
            walkOptions(n.children);
          }
        }
      }
    };
    walkOptions(el.children);
    const optionsInput = input(el, 'options') || input(el, 'data');
    if (optionsInput) {
      const ref = (optionsInput.value?.source || '').trim();
      if (constantRefs[ref]) field.optionsRef = constantRefs[ref];
      else if (localOptions[ref]) field.options = { ...localOptions[ref], ...(field.options || {}) };
    }
  };

  const visit = (nodes, ctx) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node instanceof ng.TmplAstTemplate) {
        const forItem = literalForOf(node);
        visit(node.children, forItem ? { ...ctx, forItem } : ctx);
        continue;
      }
      if (!(node instanceof ng.TmplAstElement)) continue;

      const tag = node.name.toLowerCase();

      if (MAJOR_SECTION_TAGS.has(tag)) {
        const tokens = deepTokens(node, true, true);
        if (tokens.length) {
          state.major = tokens.slice(0, 1);
          state.minor = [];
          state.label = [];
        }
        continue;
      }

      if (isTitleElement(node) && !node.children.some(c => c instanceof ng.TmplAstElement && isField(c))) {
        const tokens = deepTokens(node);
        if (tokens.length) {
          state.minor = tokens.slice(0, 1);
          state.label = [];
          continue;
        }
      }

      if (isField(node)) {
        const type = (attr(node, 'type') || '').toLowerCase();
        const multiKey = type === 'checkbox' ? multiCheckboxKey(node) : undefined;
        if (multiKey) {
          const saved = state.label;
          if (!state.label.length) state.label = state.minor.slice();
          const field = ensure(multiKey);
          state.label = saved;
          field.options = field.options || {};
          const siblings = nodes.slice(i + 1).filter(n => n instanceof ng.TmplAstElement && !containsField(n));
          for (const value of ctx.forItem ? ctx.forItem.values : []) {
            addOption(field, value, scopedTokens(siblings, { [ctx.forItem.name]: value }));
          }
          siblings.forEach(n => ctx.consumed.add(n));
          continue;
        }

        const key = fieldKey(node);
        if (!key) continue;

        if (type === 'radio') {
          if (ctx.rowLabel && !state.label.length) state.label = ctx.rowLabel;
          const field = ensure(key);
          const value = attr(node, 'value') ?? literalOf(input(node, 'value'));
          let tokens = ctx.wrappingLabel ? directTokens(ctx.wrappingLabel) : followingTokens(nodes, i, ctx);
          if (!tokens.length && ctx.colHeader) tokens = ctx.colHeader;
          addOption(field, value, tokens);
          continue;
        }

        if (type === 'checkbox') {
          let tokens = ctx.wrappingLabel ? directTokens(ctx.wrappingLabel) : followingTokens(nodes, i, ctx);
          if (!tokens.length && ctx.rowLabel) tokens = [...ctx.rowLabel, ...(ctx.colHeader || [])];
          const saved = state.label;
          if (tokens.length) state.label = tokens;
          const field = ensure(key);
          field.options = field.options || { true: ['NEDSS.COMMON.YES'], false: ['NEDSS.COMMON.NO'] };
          state.label = saved;
          continue;
        }

        const labelInput = input(node, 'label');
        const labelAttr = attr(node, 'label');
        const ownLabel = [];
        if (labelInput) translateKeysOf(labelInput.value, ownLabel);
        if (labelAttr && cleanText(labelAttr)) ownLabel.push(cleanText(labelAttr));
        if (!ownLabel.length && !state.label.length && !ctx.rowLabel) {
          const placeholderInput = input(node, 'placeholder');
          const placeholderAttr = attr(node, 'placeholder');
          if (placeholderInput) translateKeysOf(placeholderInput.value, ownLabel);
          else if (placeholderAttr && cleanText(placeholderAttr)) ownLabel.push(cleanText(placeholderAttr));
        }

        if (ctx.rowLabel && !state.label.length) state.label = [...ctx.rowLabel, ...(ctx.colHeader || [])];
        const saved = state.label;
        if (ownLabel.length) state.label = ownLabel;
        const field = ensure(key);
        state.label = saved;
        const nameAttr = attr(node, 'name');
        const modelSource = (input(node, 'ngModel')?.value?.source || '').trim();
        if (nameAttr && nameAttr !== key && /^[A-Za-z_]\w*$/.test(nameAttr) && /^[A-Za-z_]\w*$/.test(modelSource)) {
          field.aliases = [...new Set([...(field.aliases || []), nameAttr])];
        }
        if (tag === 'select' || tag === 'p-dropdown' || tag === 'p-multiselect' || tag === 'ng-multiselect-dropdown' || tag === 'mat-select') {
          collectSelectOptions(field, node);
        }
        continue;
      }

      if (ctx.consumed.has(node)) continue;

      const arrayName = attr(node, 'formArrayName') ?? literalOf(input(node, 'formArrayName'));
      if (arrayName && !fields.has(String(arrayName))) {
        const own = deepTokens(node).slice(0, 1);
        const saved = state.label;
        state.label = state.minor.length ? state.minor : (state.label.length ? state.label : own);
        ensure(String(arrayName)).array = true;
        state.label = saved;
      }

      if (tag === 'table') {
        visitTable(node, ctx);
        continue;
      }

      if (!SKIP_TEXT_TAGS.has(tag)) {
        const own = directTokens(node);
        const wrapsChoice = node.children.some(c => c instanceof ng.TmplAstElement && ['radio', 'checkbox'].includes((attr(c, 'type') || '').toLowerCase()));
        if (own.length && !(tag === 'label' && wrapsChoice)) state.label = own;
      }

      visit(node.children, { ...ctx, wrappingLabel: tag === 'label' ? node : ctx.wrappingLabel });
    }
  };

  const visitTable = (table, ctx) => {
    const findArrayName = (nodes) => {
      for (const n of nodes) {
        if (!(n instanceof ng.TmplAstElement || n instanceof ng.TmplAstTemplate)) continue;
        if (n instanceof ng.TmplAstElement) {
          const name = attr(n, 'formArrayName') ?? literalOf(input(n, 'formArrayName'));
          if (name) return String(name);
        }
        const nested = findArrayName(n.children || []);
        if (nested) return nested;
      }
      return undefined;
    };
    const tableArray = findArrayName(table.children);
    if (tableArray && !fields.has(tableArray)) {
      const saved = state.label;
      state.label = state.minor.length ? state.minor : state.label;
      ensure(tableArray).array = true;
      state.label = saved;
    }
    const rows = [];
    const collectRows = (nodes) => {
      for (const n of nodes) {
        if (n instanceof ng.TmplAstTemplate) collectRows(n.children);
        else if (n instanceof ng.TmplAstElement) {
          if (n.name.toLowerCase() === 'tr') rows.push(n);
          else collectRows(n.children);
        }
      }
    };
    collectRows(table.children);
    const cellsOf = (tr) => {
      const cells = [];
      const walk = (nodes) => nodes.forEach(n => {
        if (n instanceof ng.TmplAstTemplate) walk(n.children);
        else if (n instanceof ng.TmplAstElement && ['td', 'th'].includes(n.name.toLowerCase())) cells.push(n);
      });
      walk(tr.children);
      return cells;
    };
    const span = (cell, name) => Math.max(1, parseInt(attr(cell, name) || '1', 10) || 1);

    let headerGrid = [];
    let occupied = [];
    let inHeader = false;
    let headerRow = 0;
    for (const tr of rows) {
      const cells = cellsOf(tr);
      const hasField = cells.some(c => containsField(c));
      if (!hasField) {
        if (!inHeader) { headerGrid = []; occupied = []; headerRow = 0; inHeader = true; }
        const rowIdx = headerRow++;
        occupied[rowIdx] = occupied[rowIdx] || [];
        let col = 0;
        for (const cell of cells) {
          while (occupied[rowIdx][col]) col++;
          const tokens = deepTokens(cell);
          const cs = span(cell, 'colspan'), rs = span(cell, 'rowspan');
          for (let r = 0; r < rs; r++) {
            occupied[rowIdx + r] = occupied[rowIdx + r] || [];
            for (let c = 0; c < cs; c++) {
              occupied[rowIdx + r][col + c] = true;
              headerGrid[col + c] = headerGrid[col + c] || [];
              if (r === 0) headerGrid[col + c].push(...tokens);
            }
          }
          col += cs;
        }
        continue;
      }
      inHeader = false;
      const rowLabel = deepTokens(cells[0]);
      let col = 0;
      cells.forEach((cell, idx) => {
        const cs = span(cell, 'colspan');
        if (containsField(cell)) {
          const colHeader = [...new Set(headerGrid[col] || [])];
          state.label = [];
          visit(cell.children, { ...ctx, rowLabel: idx === 0 ? [] : rowLabel, colHeader });
        }
        col += cs;
      });
    }
  };

  const followingTokens = (nodes, i, ctx) => {
    const tokens = [];
    for (let j = i + 1; j < nodes.length; j++) {
      const n = nodes[j];
      if (n instanceof ng.TmplAstText) {
        const t = cleanText(n.value);
        if (t) tokens.push(t);
      } else if (n instanceof ng.TmplAstBoundText) {
        translateKeysOf(n.value, tokens);
      } else if (n instanceof ng.TmplAstElement) {
        if (containsField(n)) break;
        if (['label', 'span'].includes(n.name.toLowerCase())) {
          tokens.push(...deepTokens(n));
          ctx.consumed.add(n);
          break;
        }
        if (tokens.length) break;
      }
    }
    return tokens.filter(t => !NOISE_KEY.test(t));
  };

  const containsField = (node) => {
    if (node instanceof ng.TmplAstElement && isField(node)) return true;
    return (node.children || []).some(c => (c instanceof ng.TmplAstElement || c instanceof ng.TmplAstTemplate) && containsField(c));
  };

  visit(parsed.nodes, { consumed: new Set(), wrappingLabel: undefined, rowLabel: undefined, colHeader: undefined, forItem: undefined });
  for (const [target, names] of Object.entries(jsonAliases)) {
    const field = fields.get(target);
    if (field) field.aliases = [...new Set([...(field.aliases || []), ...names])];
  }
  return [...fields.values()];
}

function main() {
  const routers = readRouterMap();
  const folders = [...new Set(Object.values(routers))].sort();
  const forms = {};
  for (const folder of folders) {
    const dir = path.join(formsDir, folder);
    const html = fs.readdirSync(dir).find(f => f.endsWith('.component.html'));
    const ts = fs.readdirSync(dir).find(f => f.endsWith('.component.ts'));
    if (!html) continue;
    const tsPath = ts ? path.join(dir, ts) : '';
    forms[folder] = extractForm(path.join(dir, html), tsPath ? readConstantRefs(tsPath) : {}, readLocalOptions(tsPath), readJsonAliases(tsPath));
  }

  const routerToForm = Object.fromEntries(Object.entries(routers).sort(([a], [b]) => a.localeCompare(b)));
  const out = [
    '/* Generated by scripts/generate-investigation-form-fields.mjs - do not edit by hand. */',
    "import { InvestigationFormField } from './investigation-form-field.model';",
    '',
    `export const INVESTIGATION_FORM_BY_ROUTER: Record<string, string> = ${JSON.stringify(routerToForm, null, 2)};`,
    '',
    `export const INVESTIGATION_FORM_FIELDS: Record<string, InvestigationFormField[]> = ${JSON.stringify(forms, null, 2)};`,
    '',
  ].join('\n');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, out, 'utf8');
  const summary = Object.entries(forms).map(([k, v]) => `${k}: ${v.length} fields, ${v.filter(f => !f.label.length).length} unlabeled`).join('\n');
  console.log(summary);
}

main();

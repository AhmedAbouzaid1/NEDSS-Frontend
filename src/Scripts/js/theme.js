let themes = [
  "blue_tone",
  "blue_tone2",
  "brown_tone",
  "theme_3",
  "theme_4",
  "theme_5",
  "theme_6",
  "theme_7",
  "theme_8",
  "theme_9",
  "theme_10",
  "theme_11",
  "theme_12",
];
let strg = window.localStorage;
$(function () {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  //   if ($(".main-container").hasClass("nav-collapsed")) {
  //     $(".main-container").removeClass("nav-collapsed");
  //   }

  $(".menu-toggles").on("click", function () {
    $(".main-container").toggleClass("nav-collapsed");
    $(".menu-toggles .bi").toggleClass("bi-x-circle");
    return false;
  });

  /*$(".events-toggle") . click( function () {
        var _id= $(this).data("id");
        $(".event__item").addClass('collapse')
        $(`#${_id}`).removeClass('collapse')

        $(".events-toggle"). removeClass("bg").addClass("btn-secondary");
        $(this). removeClass("btn-secondary").addClass("bg");
        return false;
    })*/

  if (strg.getItem("theme")) {
    $("body").removeClass().addClass(strg.getItem("theme"));
  }

  $("body").append(`<div id='colorChooser'></div>`);
  $.each(themes, function (i, thm) {
    el = document.createElement("a");
    el.className = "colorChooser-item bg-" + thm;
    el.onclick = function (x) {
      // console.log(i,x);
      $("body").removeClass().addClass(themes[i]);
      strg.setItem("theme", themes[i]);
      return false;
    };
    el.text = i + 1;
    el.href = "#";
    colorChooser.appendChild(el);
  });
});

function theme() {
  _random_theme = themes[Math.floor(Math.random() * themes.length)];
  $("body").removeClass().addClass(_random_theme);
  return false;
}

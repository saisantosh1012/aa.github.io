   $(window).load(function() {
       $('.preloader').delay(3000).fadeOut('slow');
   });

   window.addEventListener('DOMContentLoaded', function() {
       CheckTheme();
   });

   var toggleTheme = document.getElementById('toggleDark2');

   toggleTheme.addEventListener('click', function() {
       //preloader first
       $('.preloader').fadeIn(10).delay(3000).fadeOut('slow');
       this.classList.toggle('bi-moon');
       ChangeTheme();
       ThemeSwap();
   })

   function ChangeTheme() {
       IsDarkOdon = localStorage.getItem("IsDarkOdon");
       if (String(IsDarkOdon) == "true") {
           localStorage.setItem("IsDarkOdon", String(false));
       } else if (String(IsDarkOdon) == "false") {
           localStorage.setItem("IsDarkOdon", String(true));
       }
   }

   var IsDarkOdon = localStorage.getItem("IsDarkOdon");
   if (IsDarkOdon == "" || IsDarkOdon === null || IsDarkOdon === "null") {
       //alert("first time load");
       localStorage.setItem("IsDarkOdon", String(true));
   }

   function CheckTheme() {
       IsDarkOdon = localStorage.getItem("IsDarkOdon");
       if (String(IsDarkOdon) == "true" || String(IsDarkOdon) == true) {
           //Dark theme 
       } else {
           ThemeSwap();
       }
   }

   function ThemeSwap() {

       var el = document.getElementById("dark1");
       var el2 = document.getElementById("dark2");
       var el3 = document.getElementById("dark3");
       var el4 = document.getElementById("visaMasterPaypal");
       if (el.href.match("../css/dark-style.css")) {
           el.href = "../css/light-style.css";
           document.getElementById("footer").classList.remove('bg-pattern');

       } else {
           el.href = "../css/dark-style.css";
           document.getElementById("footer").classList.add('bg-pattern');
       }

       if (el2.href.match("../css/dark-color.css")) {
           el2.href = "../css/light-color.css";

       } else {
           el2.href = "../css/dark-color.css";
       }

       if (el3.href.match("../css/dark-responsive.css")) {
           el3.href = "../css/light-responsive.css";

       } else {
           el3.href = "../css/dark-responsive.css";
       }
   }
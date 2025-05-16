var navbar = document.querySelector(".navbar");
var company = document.querySelector(".company");

window.onscroll = function () {
    if (window.scrollY > 50) {
        company.style.fontSize = "25px";
        navbar.style.height = "80px";
        navbar.style.padding = "10px 20px";
    } else {
        company.style.fontSize = "30px";
        navbar.style.height = "100px";
        navbar.style.padding = "15px 20px";
    }
}
let slideIndex = 1;
let autoSlideInterval;

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) { 
        slideIndex = 1; 
    } 
    if (n < 1) { 
        slideIndex = slides.length; 
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; 
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", ""); 
    }

    slides[slideIndex - 1].style.display = "block"; 
    dots[slideIndex - 1].className += " active"; 
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        plusSlides(1); 
    }, 5000); 
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

showSlides(slideIndex); 
startAutoSlide(); 

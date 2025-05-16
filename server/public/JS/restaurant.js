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

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

// Automatic sliding
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        plusSlides(1); 
    }, 5000); 
}

// Stop the automatic sliding
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}


showSlides(slideIndex); 
startAutoSlide(); 

window.addEventListener('scroll', () => {
    const footerContent = document.querySelector('footer');
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    
    const scrollFromBottom = pageHeight - scrollPosition;

    
    if (scrollFromBottom <= 74) {
        footerContent.style.transform = `translateY(-${Math.min(74 - scrollFromBottom, 74)}px)`;
    } else {
        footerContent.style.transform = 'translateY(0)'; 
    }
});





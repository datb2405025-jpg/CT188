const cuon = document.getElementById('nut-cuon');
const den = document.getElementById('cuon-den');
const anh =document.querySelectorAll('.main-container__img1')[0];
const tieuDe = document.querySelectorAll('.sidebar-title');
const grid_cha = document.querySelectorAll('.main-content')[0];
const grid_con = document.querySelectorAll('.main-content__article__2sides');


cuon.addEventListener("click", () => {
    den.scrollIntoView(
        {
            behavior:"smooth"
        }
    )
});

anh.addEventListener("click", ()=> {
    window.location.href="index.html"
});

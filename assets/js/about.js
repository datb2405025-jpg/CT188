/* Tên: Nguyễn Dức Duy
    MSSV:B2404979
    ngày thực hiện:20/11/2026

    ngày update 1:22/11/2026
*/

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


const change_grid_cha = ["1fr 1fr", "1fr 1fr 1fr", "1fr"];
const change_grid_con= ["1fr", "1fr 1fr", "1fr 2fr"];
let count_click=0;


tieuDe.forEach(item => {
    item.addEventListener("click", () =>
    {
        const i = count_click++ % change_grid_cha.length;

        grid_cha.style.gridTemplateColumns = change_grid_cha[i];

        grid_con.forEach(it => {
            it.style.gridTemplateColumns = change_grid_con[i];
        });
    });
});

const cuon = document.getElementById('nut-cuon');
const den = document.getElementById('cuon-den');

cuon.addEventListener("click", () => {
    den.scrollIntoView(
        {
            behavior:"smooth",
        }
    )
});

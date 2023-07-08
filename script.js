window.onload = function() {
    let stars = document.getElementById('stars');
    for (let i = 0; i < 1000; i++) {
        let star = document.createElement('div');
        star.className = 'star';
        star.style.top = Math.random() * window.innerHeight + 'px';
        star.style.left = Math.random() * window.innerWidth + 'px';
        stars.appendChild(star);
    }
}
const scene = document.querySelector('#scene');
const sparkTargets = document.querySelectorAll('.spark-target');

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createSpark(x, y, burstScale = 1) {
    const spark = document.createElement('span');
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(24, 86) * burstScale;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const size = randomBetween(5, 11);
    const isBig = Math.random() > 0.78;

    spark.className = `spark${isBig ? ' big' : ''}`;
    spark.style.setProperty('--x', `${x}px`);
    spark.style.setProperty('--y', `${y}px`);
    spark.style.setProperty('--dx', `${dx}px`);
    spark.style.setProperty('--dy', `${dy}px`);
    spark.style.setProperty('--size', `${size}px`);

    scene.appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove(), { once: true });
}

function sparkleBurst(x, y, count = 20, burstScale = 1) {
    for (let i = 0; i < count; i += 1) {
        createSpark(x, y, burstScale);
    }
}

function centerPoint(element) {
    const rect = element.getBoundingClientRect();
    const parentRect = scene.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2 - parentRect.left,
        y: rect.top + rect.height / 2 - parentRect.top,
    };
}

function popElement(element) {
    element.classList.remove('pop');
    void element.offsetWidth;
    element.classList.add('pop');
}

sparkTargets.forEach((target) => {
    target.addEventListener('click', (event) => {
        const parentRect = scene.getBoundingClientRect();
        const x = event.clientX - parentRect.left;
        const y = event.clientY - parentRect.top;

        sparkleBurst(x, y, 28, 1.2);
        popElement(target);
    });
});

scene.addEventListener('click', (event) => {
    if (event.target.closest('.spark-target')) {
        return;
    }

    const parentRect = scene.getBoundingClientRect();
    sparkleBurst(
        event.clientX - parentRect.left,
        event.clientY - parentRect.top,
        16,
        0.95
    );
});

function autoTwinkle() {
    sparkTargets.forEach((target) => {
        const { x, y } = centerPoint(target);
        const nx = x + randomBetween(-36, 36);
        const ny = y + randomBetween(-44, 44);
        sparkleBurst(nx, ny, 4, 0.75);
    });
}

setInterval(autoTwinkle, 900);
autoTwinkle();

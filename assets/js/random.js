document.addEventListener("DOMContentLoaded", function () {
    let container = document.querySelector(".isotope");
    let items = Array.from(container.children);

    // Shuffle function
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(items);

    // Append shuffled items back to the container
    items.forEach(item => container.appendChild(item));
});

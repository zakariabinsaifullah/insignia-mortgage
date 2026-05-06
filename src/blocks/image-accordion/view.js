document.addEventListener('DOMContentLoaded', function () {
    // Support new structure (.insignia-image-accordion wrapper)
    // and old structure (items directly inside .wp-block-insignia-image-accordion)
    var containers = [];

    document.querySelectorAll('.insignia-image-accordion').forEach(function (el) {
        containers.push(el);
    });

    // fallback: old saved blocks without the inner wrapper
    document.querySelectorAll('.wp-block-insignia-image-accordion').forEach(function (el) {
        if (!el.querySelector('.insignia-image-accordion')) {
            containers.push(el);
        }
    });

    containers.forEach(function (accordion) {
        var accordionItems = accordion.querySelectorAll('.wp-block-insignia-image-accordion-item');

        if (!accordionItems.length) return;

        var i = 0;
        accordionItems.forEach(function (item) {
            i++;
            // set first item active by default
            if (i === 1) {
                item.classList.add('active');
            }

            item.addEventListener('click', function () {
                accordionItems.forEach(function (sibling) {
                    sibling.classList.remove('active');
                });
                item.classList.add('active');
            });
        });
    });
});

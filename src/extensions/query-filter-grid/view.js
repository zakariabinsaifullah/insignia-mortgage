document.addEventListener('DOMContentLoaded', function () {
    var wrappers = document.querySelectorAll('.insignia-query-filter-grid-wrapper');

    wrappers.forEach(function (wrapper) {
        var buttons = wrapper.querySelectorAll('.insignia-filter-btn');

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                buttons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
            });
        });
    });
});
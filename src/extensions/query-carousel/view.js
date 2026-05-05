document.addEventListener('DOMContentLoaded', function () {
    var carousels = document.querySelectorAll('.insignia-query-carousel');
    carousels.forEach(function (carousel) {
        var optionsAttr = carousel.getAttribute('data-qc-options');
        if (!optionsAttr) return;

        var options;
        try {
            options = JSON.parse(optionsAttr);
        } catch (e) {
            return;
        }

        var loop = options.loop !== undefined ? options.loop : true;
        var autoplay = options.autoplay || false;
        var columns = options.columns || { Desktop: 3, Tablet: 2, Mobile: 1 };
        var gaps = options.gaps || { Desktop: 20, Tablet: 15, Mobile: 0 };

        var swiperEl = carousel.querySelector('.swiper');
        if (!swiperEl) return;

        var prevEl = carousel.querySelector('.swiper-custom-prev');
        var nextEl = carousel.querySelector('.swiper-custom-next');
        var paginationEl = carousel.querySelector('.swiper-pagination');

        var swiperConfig = {
            loop: loop,
            autoplay: autoplay,
            navigation: {},
            pagination: {},
            touchRatio: 1,
            touchAngle: 45,
            grabCursor: true,
            allowTouchMove: true,
            touchMoveStopPropagation: false,
            touchStartPreventDefault: false,
            touchStartForcePreventDefault: false,
            touchReleaseOnEdges: true,
            slidesPerView: columns.Desktop || 1,
            spaceBetween: gaps.Desktop || 20,
            breakpoints: {
                320: {
                    slidesPerView: columns.Mobile || 1,
                    spaceBetween: gaps.Mobile || 0
                },
                768: {
                    slidesPerView: columns.Tablet || 2,
                    spaceBetween: gaps.Tablet || 15
                },
                1025: {
                    slidesPerView: columns.Desktop || 1,
                    spaceBetween: gaps.Desktop || 20
                }
            }
        };

        if (prevEl) {
            swiperConfig.navigation.prevEl = prevEl;
        }
        if (nextEl) {
            swiperConfig.navigation.nextEl = nextEl;
        }
        if (paginationEl) {
            swiperConfig.pagination.el = paginationEl;
            swiperConfig.pagination.clickable = true;
        }

        new Swiper(swiperEl, swiperConfig);
    });
});
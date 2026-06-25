document.addEventListener( 'DOMContentLoaded', function () {
    const carousels = document.querySelectorAll( '.insignia-query-carousel' );
    carousels.forEach( function ( carousel ) {
        const optionsAttr = carousel.getAttribute( 'data-qc-options' );
        if ( ! optionsAttr ) {
            return;
        }

        let options;
        try {
            options = JSON.parse( optionsAttr );
        } catch ( e ) {
            return;
        }

        const loop = options.loop !== undefined ? options.loop : true;
        const autoplay = options.autoplay || false;
        const columns = options.columns || { Desktop: 3, Tablet: 2, Mobile: 1 };
        const gaps = options.gaps || { Desktop: 20, Tablet: 15, Mobile: 0 };

        const swiperEl = carousel.querySelector( '.swiper' );
        if ( ! swiperEl ) {
            return;
        }

        const prevEl = carousel.querySelector( '.swiper-custom-prev' );
        const nextEl = carousel.querySelector( '.swiper-custom-next' );
        const paginationEl = carousel.querySelector( '.swiper-pagination' );

        const swiperConfig = {
            loop,
            autoplay,
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

        if ( prevEl ) {
            swiperConfig.navigation.prevEl = prevEl;
        }
        if ( nextEl ) {
            swiperConfig.navigation.nextEl = nextEl;
        }
        if ( paginationEl ) {
            swiperConfig.pagination.el = paginationEl;
            swiperConfig.pagination.clickable = true;
        }

        new Swiper( swiperEl, swiperConfig );
    } );
} );

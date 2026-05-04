document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.wp-block-insignia-team-carousel').forEach(initCarousel);
});

function initCarousel(wrapper) {
    // ── Swiper initialisation ─────────────────────────────────────────────────
    const options = JSON.parse(wrapper.getAttribute('data-options') || '{}');
    const { loop, autoplay, columns, gaps } = options;

    new Swiper(wrapper.querySelector('.swiper'), {
        loop: loop,
        autoplay: autoplay,
        grabCursor: true,
        touchRatio: 1,
        touchAngle: 45,
        allowTouchMove: true,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: false,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: true,
        navigation: {
            nextEl: wrapper.querySelector('.swiper-custom-next'),
            prevEl: wrapper.querySelector('.swiper-custom-prev')
        },
        pagination: {
            el: wrapper.querySelector('.swiper-pagination'),
            clickable: true
        },
        slidesPerView: columns?.Desktop || 3,
        spaceBetween: gaps?.Desktop || 24,
        breakpoints: {
            320: {
                slidesPerView: columns?.Mobile || 1,
                spaceBetween: gaps?.Mobile || 12
            },
            768: {
                slidesPerView: columns?.Tablet || 2,
                spaceBetween: gaps?.Tablet || 16
            },
            1025: {
                slidesPerView: columns?.Desktop || 3,
                spaceBetween: gaps?.Desktop || 24
            }
        }
    });

    // ── Popup ─────────────────────────────────────────────────────────────────
    const popup = wrapper.querySelector('.insignia-team-carousel__popup');
    const overlay = wrapper.querySelector('.insignia-team-carousel__popup-overlay');
    const closeBtn = wrapper.querySelector('.insignia-team-carousel__popup-close');
    const content = wrapper.querySelector('.insignia-team-carousel__popup-content');

    if (!popup || !content) return;

    wrapper.querySelectorAll('.insignia-team-card').forEach(function (card) {
        card.addEventListener('click', function () {
            openPopup(this);
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPopup(this);
            }
        });
    });

    function openPopup(card) {
        let member = {};
        try {
            member = JSON.parse(card.dataset.member || '{}');
        } catch (err) {
            return;
        }

        content.innerHTML = buildContent(member);

        popup.removeAttribute('aria-hidden');
        popup.classList.add('is-active');
        document.body.classList.add('insignia-popup-open');
        closeBtn.focus();
    }

    function closePopup() {
        popup.classList.remove('is-active');
        popup.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('insignia-popup-open');
    }

    overlay.addEventListener('click', closePopup);
    closeBtn.addEventListener('click', closePopup);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('is-active')) {
            closePopup();
        }
    });

    function buildContent(m) {
        const photoHtml = m.imageUrl
            ? `<div class="insignia-team-popup__photo">
				<img src="${esc(m.imageUrl)}" alt="${esc(m.imageAlt || m.name)}" loading="lazy">
			   </div>`
            : '';

        const linkedinHtml = m.linkedin
            ? `<p class="insignia-team-popup__meta">
				<strong>LinkedIn:</strong>
				<a href="${esc(m.linkedin)}" target="_blank" rel="noopener noreferrer">${esc(m.linkedin)}</a>
			   </p>`
            : '';

        const bioHtml = m.bio
            ? `<div class="insignia-team-popup__bio">
				<h3 class="insignia-team-popup__bio-title">Experience and Background</h3>
				<div class="insignia-team-popup__bio-content">${m.bio}</div>
			   </div>`
            : '';

        return `
			<div class="insignia-team-popup__header">
				${photoHtml}
				<div class="insignia-team-popup__info">
					<h2 class="insignia-team-popup__name">${esc(m.name)}</h2>
					${m.designation ? `<p class="insignia-team-popup__designation">${esc(m.designation)}</p>` : ''}
					${linkedinHtml}
				</div>
			</div>
			${bioHtml}
		`;
    }
}

function esc(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

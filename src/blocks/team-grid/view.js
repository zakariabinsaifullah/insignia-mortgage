document.addEventListener('DOMContentLoaded', function () {
    // Each block instance is independent — handle multiple grids on one page.
    document.querySelectorAll('.wp-block-insignia-team-grid').forEach(initGrid);
});

function initGrid(grid) {
    const popup = grid.querySelector('.insignia-team-grid__popup');
    const overlay = grid.querySelector('.insignia-team-grid__popup-overlay');
    const closeBtn = grid.querySelector('.insignia-team-grid__popup-close');
    const content = grid.querySelector('.insignia-team-grid__popup-content');

    if (!popup || !content) return;

    // ── Open ─────────────────────────────────────────────────────────────────
    grid.querySelectorAll('.insignia-team-card').forEach(function (card) {
        // Click to open.
        card.addEventListener('click', function () {
            openPopup(this);
        });

        // Keyboard: Enter / Space to open (card has role="button").
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

        // Move focus to the close button for accessibility.
        closeBtn.focus();
    }

    // ── Close ────────────────────────────────────────────────────────────────
    function closePopup() {
        popup.classList.remove('is-active');
        popup.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('insignia-popup-open');
    }

    overlay.addEventListener('click', closePopup);
    closeBtn.addEventListener('click', closePopup);

    // Close on Escape key.
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('is-active')) {
            closePopup();
        }
    });

    // ── Build popup HTML from member data ─────────────────────────────────────
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

        // Bio comes from apply_filters('the_content') in PHP — it is trusted HTML.
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

/**
 * Escapes a string for safe insertion into HTML text / attribute values.
 * Only used for plain-text fields from the member data object.
 *
 * @param {*} value
 * @return {string}
 */
function esc(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

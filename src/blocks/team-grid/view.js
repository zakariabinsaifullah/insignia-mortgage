/**
 * Team Grid — frontend popup interaction.
 *
 * Mirrors the click-to-open / click-to-close pattern used by image-accordion
 * (vanilla DOM, no jQuery, no module imports). Each `.wp-block-insignia-team-grid`
 * instance is fully independent — a unique popup per block, scoped handlers,
 * and a once-only guard against double-binding.
 */
document.addEventListener( 'DOMContentLoaded', function () {
    document.querySelectorAll( '.wp-block-insignia-team-grid' ).forEach( function ( root ) {
        if ( root.dataset.teamGridBound === '1' ) {
            return;
        }
        root.dataset.teamGridBound = '1';

        // ── Data lookup ───────────────────────────────────────────────────────
        let members = [];
        try {
            members = JSON.parse( root.dataset.members || '[]' );
        } catch ( e ) {
            members = [];
        }
        const byId = {};
        members.forEach( function ( m ) {
            if ( m && m.id !== undefined && m.id !== null ) {
                byId[ String( m.id ) ] = m;
            }
        } );

        // ── Popup element references (within this block only) ────────────────
        const popup = root.querySelector( '.insignia-team-popup' );
        if ( ! popup ) {
            return;
        }
        const backdrop = popup.querySelector( '.insignia-team-popup__backdrop' );
        const closeBtn = popup.querySelector( '.insignia-team-popup__close' );
        const imgEl = popup.querySelector( '.insignia-team-popup__image' );
        const imgWrap = popup.querySelector( '.insignia-team-popup__image-wrap' );
        const nameEl = popup.querySelector( '.insignia-team-popup__name' );
        const desigEl = popup.querySelector( '.insignia-team-popup__designation' );
        const linkEl = popup.querySelector( '.insignia-team-popup__linkedin-link' );
        const bioEl = popup.querySelector( '.insignia-team-popup__bio' );

        let triggerEl = null; // element to restore focus to on close

        // ── Open / close ─────────────────────────────────────────────────────
        function openPopup( card ) {
            const id = card.dataset.memberId;
            const m = byId[ id ];
            if ( ! m ) {
                return;
            }
            triggerEl = card;

            // Image
            if ( m.imageUrl ) {
                imgEl.src = m.imageUrl;
                imgEl.alt = m.imageAlt || m.name || '';
                imgEl.hidden = false;
                if ( imgWrap ) {
                    imgWrap.hidden = false;
                }
            } else {
                imgEl.removeAttribute( 'src' );
                imgEl.alt = '';
                imgEl.hidden = true;
                if ( imgWrap ) {
                    imgWrap.hidden = true;
                }
            }

            // Name
            nameEl.textContent = m.name || '';

            // Designation
            if ( m.designation ) {
                desigEl.textContent = m.designation;
                desigEl.hidden = false;
            } else {
                desigEl.textContent = '';
                desigEl.hidden = true;
            }

            // LinkedIn
            if ( m.linkedin ) {
                linkEl.href = m.linkedin;
                linkEl.hidden = false;
            } else {
                linkEl.removeAttribute( 'href' );
                linkEl.hidden = true;
            }

            // Bio
            bioEl.innerHTML = m.content || '';
            bioEl.hidden = ! m.content;

            // Show
            popup.classList.add( 'is-open' );
            popup.setAttribute( 'aria-hidden', 'false' );
            document.body.classList.add( 'is-locked' );
            // Focus the close button after the dialog becomes visible.
            if ( closeBtn ) {
                closeBtn.focus();
            }
        }

        function closePopup() {
            popup.classList.remove( 'is-open' );
            popup.setAttribute( 'aria-hidden', 'true' );
            document.body.classList.remove( 'is-locked' );
            if ( triggerEl && typeof triggerEl.focus === 'function' ) {
                triggerEl.focus();
            }
            triggerEl = null;
        }

        // ── Card click + keyboard ────────────────────────────────────────────
        root.querySelectorAll( '.insignia-team-card' ).forEach( function ( card ) {
            card.addEventListener( 'click', function ( event ) {
                // Let interactive descendants (LinkedIn link, etc.) work normally.
                if ( event.target.closest( 'a, button, input, select, textarea' ) ) {
                    return;
                }
                openPopup( card );
            } );
            card.addEventListener( 'keydown', function ( event ) {
                if ( event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar' ) {
                    event.preventDefault();
                    openPopup( card );
                }
            } );
        } );

        // ── Close triggers ───────────────────────────────────────────────────
        // X button + backdrop (backdrop is a div, so use a delegated click on the
        // popup itself and check that the click target is exactly the backdrop).
        popup.addEventListener( 'click', function ( event ) {
            const target = event.target;
            if ( target.closest( '[data-popup-close]' ) ) {
                closePopup();
                return;
            }
            if ( target === backdrop ) {
                closePopup();
            }
        } );

        // Escape key — document-level, only effective while open.
        document.addEventListener( 'keydown', function ( event ) {
            if ( event.key === 'Escape' && popup.classList.contains( 'is-open' ) ) {
                closePopup();
            }
        } );

        // Focus trap — only bind while open, so the dialog's own keydown handler
        // doesn't fight with the document-level Escape listener.
        popup.addEventListener( 'keydown', function ( event ) {
            if ( event.key !== 'Tab' ) {
                return;
            }
            const focusables = popup.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
            );
            if ( focusables.length === 0 ) {
                return;
            }
            const visible = Array.from( focusables ).filter( function ( el ) {
                return ! el.hidden && el.offsetParent !== null;
            } );
            if ( visible.length === 0 ) {
                return;
            }
            const first = visible[ 0 ];
            const last = visible[ visible.length - 1 ];
            const active = popup.ownerDocument.activeElement;
            if ( event.shiftKey && active === first ) {
                event.preventDefault();
                last.focus();
            } else if ( ! event.shiftKey && active === last ) {
                event.preventDefault();
                first.focus();
            }
        } );
    } );
} );

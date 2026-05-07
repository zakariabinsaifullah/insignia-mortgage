(function () {
    'use strict';

    var PANEL_ID   = 'blnt-form-panel';
    var OVERLAY_ID = 'blnt-form-overlay';
    var OPEN_CLASS = 'is-open';
    var LOCK_CLASS = 'blnt-panel-open';

    var lastTrigger = null;

    function panel()   { return document.getElementById( PANEL_ID ); }
    function overlay() { return document.getElementById( OVERLAY_ID ); }

    function openPanel() {
        var p = panel(), o = overlay();
        if ( ! p || ! o ) return;

        p.classList.add( OPEN_CLASS );
        o.classList.add( OPEN_CLASS );
        document.body.classList.add( LOCK_CLASS );
        p.setAttribute( 'aria-hidden', 'false' );

        var closeBtn = p.querySelector( '.blnt-form-panel__close' );
        if ( closeBtn ) closeBtn.focus();
    }

    function closePanel() {
        var p = panel(), o = overlay();
        if ( ! p || ! o ) return;

        p.classList.remove( OPEN_CLASS );
        o.classList.remove( OPEN_CLASS );
        document.body.classList.remove( LOCK_CLASS );
        p.setAttribute( 'aria-hidden', 'true' );

        if ( lastTrigger ) lastTrigger.focus();
        lastTrigger = null;
    }

    // Trigger: <a href="#blnt-form-panel"> or [data-open="blnt-form-panel"]
    document.addEventListener( 'click', function ( e ) {
        var trigger = e.target.closest(
            'a[href="#' + PANEL_ID + '"], [data-open="' + PANEL_ID + '"]'
        );

        if ( trigger ) {
            e.preventDefault();
            lastTrigger = trigger;
            openPanel();
            return;
        }

        // Close button inside panel
        if ( e.target.closest( '.blnt-form-panel__close' ) ) {
            closePanel();
            return;
        }

        // Click on overlay
        var o = overlay();
        if ( o && e.target === o ) {
            closePanel();
        }
    } );

    // Escape key
    document.addEventListener( 'keydown', function ( e ) {
        var p = panel();
        if ( e.key === 'Escape' && p && p.classList.contains( OPEN_CLASS ) ) {
            closePanel();
        }
    } );

})();

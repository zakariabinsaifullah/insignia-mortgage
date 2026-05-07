( function () {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function () {
		document.querySelectorAll( '.ipg-wrapper' ).forEach( function ( wrapper ) {
			var config         = JSON.parse( wrapper.dataset.config || '{}' );
			var postsEl        = wrapper.querySelector( '.ipg-posts' );
			var paginationEl   = wrapper.querySelector( '.ipg-pagination-wrap' );
			var activeCat      = 0;
			var activePage     = 1;
			var loading        = false;

			function fetchPosts() {
				if ( loading ) return;
				loading = true;
				wrapper.classList.add( 'is-loading' );

				var body = new URLSearchParams( {
					action:    'insignia_posts_grid',
					nonce:     config.nonce,
					cat:       activeCat,
					page:      activePage,
					per_page:  config.perPage  || 6,
					post_type: config.postType || 'post',
				} );

				fetch( config.ajaxUrl, { method: 'POST', body: body } )
					.then( function ( r ) { return r.json(); } )
					.then( function ( data ) {
						if ( data.success ) {
							postsEl.innerHTML      = data.data.html;
							paginationEl.innerHTML = data.data.pagination;
							bindPagination();
						}
					} )
					.finally( function () {
						loading = false;
						wrapper.classList.remove( 'is-loading' );
					} );
			}

			function bindPagination() {
				paginationEl.querySelectorAll( '.ipg-page-btn' ).forEach( function ( btn ) {
					btn.addEventListener( 'click', function () {
						activePage = parseInt( this.dataset.page, 10 );
						fetchPosts();
						wrapper.scrollIntoView( { behavior: 'smooth', block: 'start' } );
					} );
				} );
			}

			// Filter buttons
			wrapper.querySelectorAll( '.ipg-filter-btn' ).forEach( function ( btn ) {
				btn.addEventListener( 'click', function () {
					wrapper.querySelectorAll( '.ipg-filter-btn' ).forEach( function ( b ) {
						b.classList.remove( 'active' );
					} );
					this.classList.add( 'active' );
					activeCat  = parseInt( this.dataset.cat || '0', 10 );
					activePage = 1;
					fetchPosts();
				} );
			} );

			// Bind pagination on initial load
			bindPagination();
		} );
	} );
}() );

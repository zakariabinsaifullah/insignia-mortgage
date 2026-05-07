document.addEventListener( 'DOMContentLoaded', function () {
	document.querySelectorAll( '.insignia-query-filter-grid-wrapper' ).forEach( function ( wrapper ) {
		const config      = JSON.parse( wrapper.dataset.config || '{}' );
		const postsEl     = wrapper.querySelector( '.insignia-filter-grid-posts' );
		const paginationEl = wrapper.querySelector( '.insignia-filter-grid-pagination' );

		let activeCat  = 0;
		let activePage = 1;
		let loading    = false;

		function fetchPosts() {
			if ( loading ) return;
			loading = true;
			wrapper.classList.add( 'is-loading' );

			const body = new URLSearchParams( {
				action:    'insignia_filter_grid',
				nonce:     config.nonce,
				cat:       activeCat,
				page:      activePage,
				per_page:  config.perPage  || 6,
				post_type: config.postType || 'post',
			} );

			fetch( config.ajaxUrl, { method: 'POST', body } )
				.then( function ( r ) { return r.json(); } )
				.then( function ( data ) {
					if ( data.success ) {
						postsEl.innerHTML     = data.data.html;
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
			paginationEl.querySelectorAll( '.insignia-page-btn' ).forEach( function ( btn ) {
				btn.addEventListener( 'click', function () {
					activePage = parseInt( this.dataset.page, 10 );
					fetchPosts();
					wrapper.scrollIntoView( { behavior: 'smooth', block: 'start' } );
				} );
			} );
		}

		// Filter buttons
		wrapper.querySelectorAll( '.insignia-filter-btn' ).forEach( function ( btn ) {
			btn.addEventListener( 'click', function () {
				wrapper.querySelectorAll( '.insignia-filter-btn' ).forEach( function ( b ) {
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

<?php

/**
 * Creates a duplicate of a post/page/cpt as a draft and redirects to its edit screen.
 */
function insignia_duplicate_post_as_draft() {
	if ( ! ( isset( $_GET['post'] ) || isset( $_POST['post'] ) || ( isset( $_REQUEST['action'] ) && 'insignia_duplicate_post_as_draft' === $_REQUEST['action'] ) ) ) {
		wp_die( __( 'No post to duplicate has been supplied!', 'insignia' ) );
	}

	/*
	 * Nonce verification for security
	 */
	if ( ! isset( $_GET['duplicate_nonce'] ) || ! wp_verify_nonce( $_GET['duplicate_nonce'], basename( __FILE__ ) ) ) {
		wp_die( __( 'Security check failed.', 'insignia' ) );
	}

	/*
	 * Get the original post ID
	 */
	$post_id = ( isset( $_GET['post'] ) ? absint( $_GET['post'] ) : absint( $_POST['post'] ) );
	
	/*
	 * And all the original post data
	 */
	$post = get_post( $post_id );

	/*
	 * Set the post author to the current user capturing it
	 */
	$current_user    = wp_get_current_user();
	$new_post_author = $current_user->ID;

	/*
	 * If post data exists, create the post duplicate
	 */
	if ( isset( $post ) && $post != null ) {

		/*
		 * New post data array
		 */
		$args = array(
			'comment_status' => $post->comment_status,
			'ping_status'    => $post->ping_status,
			'post_author'    => $new_post_author,
			'post_content'   => $post->post_content,
			'post_excerpt'   => $post->post_excerpt,
			'post_name'      => $post->post_name,
			'post_parent'    => $post->post_parent,
			'post_password'  => $post->post_password,
			'post_status'    => 'draft',
			'post_title'     => $post->post_title . ' (Copy)',
			'post_type'      => $post->post_type,
			'to_ping'        => $post->to_ping,
			'menu_order'     => $post->menu_order
		);

		/*
		 * Insert the post by wp_insert_post() function
		 */
		$new_post_id = wp_insert_post( $args );

		/*
		 * Get all current post terms and set them to the new post draft
		 */
		$taxonomies = get_object_taxonomies( $post->post_type ); // returns array of taxonomy names for post type
		foreach ( $taxonomies as $taxonomy ) {
			$post_terms = wp_get_object_terms( $post_id, $taxonomy, array( 'fields' => 'slugs' ) );
			wp_set_object_terms( $new_post_id, $post_terms, $taxonomy, false );
		}

		/*
		 * Duplicate all post meta securely
		 */
		$post_meta = get_post_meta( $post_id );
		if ( $post_meta ) {
			foreach ( $post_meta as $meta_key => $meta_values ) {
				// Prevent duplicating the old slugs
				if ( '_wp_old_slug' === $meta_key ) {
					continue;
				}
				foreach ( $meta_values as $meta_value ) {
					add_post_meta( $new_post_id, $meta_key, maybe_unserialize( $meta_value ) );
				}
			}
		}

		/*
		 * Finally, redirect to the edit post screen for the new draft
		 */
		wp_redirect( admin_url( 'post.php?action=edit&post=' . $new_post_id ) );
		exit;
	} else {
		wp_die( __( 'Post creation failed, could not find original post.', 'insignia' ) );
	}
}
add_action( 'admin_action_insignia_duplicate_post_as_draft', 'insignia_duplicate_post_as_draft' );

/**
 * Add the duplicate link to action list for post_row_actions and page_row_actions
 */
function insignia_duplicate_post_link( $actions, $post ) {
	if ( current_user_can( 'edit_posts' ) ) {
		$actions['duplicate'] = '<a href="' . wp_nonce_url( admin_url( 'admin.php?action=insignia_duplicate_post_as_draft&post=' . $post->ID ), basename( __FILE__ ), 'duplicate_nonce' ) . '" title="' . esc_attr__( 'Duplicate this item', 'insignia' ) . '" rel="permalink">' . __( 'Duplicate', 'insignia' ) . '</a>';
	}
	return $actions;
}
add_filter( 'post_row_actions', 'insignia_duplicate_post_link', 10, 2 );
add_filter( 'page_row_actions', 'insignia_duplicate_post_link', 10, 2 );

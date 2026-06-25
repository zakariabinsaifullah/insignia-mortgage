<?php

function insignia_register_team_cpt() {
    $labels = [
        'name'                  => _x( 'Team', 'Post Type General Name', 'insignia' ),
        'singular_name'         => _x( 'Team Member', 'Post Type Singular Name', 'insignia' ),
        'menu_name'             => __( 'Team', 'insignia' ),
        'name_admin_bar'        => __( 'Team Member', 'insignia' ),
        'archives'              => __( 'Team Archives', 'insignia' ),
        'attributes'            => __( 'Team Attributes', 'insignia' ),
        'parent_item_colon'     => __( 'Parent Team Member:', 'insignia' ),
        'all_items'             => __( 'All Members', 'insignia' ),
        'add_new_item'          => __( 'Add New Member', 'insignia' ),
        'add_new'               => __( 'Add New', 'insignia' ),
        'new_item'              => __( 'New Member', 'insignia' ),
        'edit_item'             => __( 'Edit Member', 'insignia' ),
        'update_item'           => __( 'Update Member', 'insignia' ),
        'view_item'             => __( 'View Member', 'insignia' ),
        'view_items'            => __( 'View Team', 'insignia' ),
        'search_items'          => __( 'Search Team Member', 'insignia' ),
        'not_found'             => __( 'Not found', 'insignia' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'insignia' ),
        'featured_image'        => __( 'Team Member Image', 'insignia' ),
        'set_featured_image'    => __( 'Set Team Member Image', 'insignia' ),
        'remove_featured_image' => __( 'Remove Team Member Image', 'insignia' ),
        'use_featured_image'    => __( 'Use as Team Member Image', 'insignia' ),
        'insert_into_item'      => __( 'Insert into item', 'insignia' ),
        'uploaded_to_this_item' => __( 'Uploaded to this item', 'insignia' ),
        'items_list'            => __( 'Team list', 'insignia' ),
        'items_list_navigation' => __( 'Team list navigation', 'insignia' ),
        'filter_items_list'     => __( 'Filter team list', 'insignia' ),
    ];
    $args = [
        'label'                 => __( 'Team Member', 'insignia' ),
        'labels'                => $labels,
        'supports'              => [ 'title', 'editor', 'thumbnail' ],
        'hierarchical'          => false,
        'public'                => false,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 20,
        'menu_icon'             => 'dashicons-groups',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => false,
        'can_export'            => true,
        'has_archive'           => false,
        'exclude_from_search'   => true,
        'publicly_queryable'    => false,
        'show_in_rest'          => true,
        'rewrite'               => false,
    ];
    register_post_type( 'team', $args );
}
add_action( 'init', 'insignia_register_team_cpt', 0 );

function insignia_team_title_placeholder( $title, $post ) {
    if ( 'team' === $post->post_type ) {
        return __( 'Add name', 'insignia' );
    }
    return $title;
}
add_filter( 'enter_title_here', 'insignia_team_title_placeholder', 10, 2 );


function insignia_team_prevent_single( $query ) {
    if ( ! is_admin() && $query->is_main_query() && $query->is_singular( 'team' ) ) {
        $query->set_404();
    }
}
add_action( 'pre_get_posts', 'insignia_team_prevent_single' );


function insignia_team_meta_boxes() {
    add_meta_box(
        'insignia_team_meta',
        __( 'Team Member Details', 'insignia' ),
        'insignia_team_meta_callback',
        'team',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'insignia_team_meta_boxes' );

function insignia_team_meta_callback( $post ) {
    wp_nonce_field( 'insignia_team_meta_nonce_action', 'insignia_team_meta_nonce' );

    $designation = get_post_meta( $post->ID, '_team_designation', true );
    $linkedin    = get_post_meta( $post->ID, '_team_linkedin', true );

    echo '<div style="margin-bottom: 15px;">';
    echo '<label for="team_designation" style="display:block; font-weight:bold; margin-bottom:5px;">' . __( 'Designation', 'insignia' ) . '</label>';
    echo '<input type="text" id="team_designation" name="team_designation" value="' . esc_attr( $designation ) . '" style="width:100%;">';
    echo '</div>';

    echo '<div style="margin-bottom: 15px;">';
    echo '<label for="team_linkedin" style="display:block; font-weight:bold; margin-bottom:5px;">' . __( 'LinkedIn Profile URL', 'insignia' ) . '</label>';
    echo '<input type="url" id="team_linkedin" name="team_linkedin" value="' . esc_attr( $linkedin ) . '" style="width:100%;">';
    echo '</div>';
}

function insignia_save_team_meta( $post_id ) {
    if ( ! isset( $_POST['insignia_team_meta_nonce'] ) ) {
        return;
    }
    if ( ! wp_verify_nonce( $_POST['insignia_team_meta_nonce'], 'insignia_team_meta_nonce_action' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    if ( isset( $_POST['team_designation'] ) ) {
        update_post_meta( $post_id, '_team_designation', sanitize_text_field( wp_unslash( $_POST['team_designation'] ) ) );
    }
    if ( isset( $_POST['team_linkedin'] ) ) {
        update_post_meta( $post_id, '_team_linkedin', esc_url_raw( wp_unslash( $_POST['team_linkedin'] ) ) );
    }
}
add_action( 'save_post_team', 'insignia_save_team_meta' );

function insignia_team_columns( $columns ) {
	$new_columns = [];
	foreach ( $columns as $key => $title ) {
		$new_columns[ $key ] = $title;

		if ( 'title' === $key ) {
			$new_columns['post_id'] = __( 'ID', 'insignia' );
		}

		if ( 'date' === $key ) {
			unset( $new_columns['date'] );
			$new_columns['team_designation'] = __( 'Designation', 'insignia' );
			$new_columns['team_linkedin']    = __( 'LinkedIn', 'insignia' );
			$new_columns['date']             = $title;
		}
	}
	return $new_columns;
}
add_filter( 'manage_team_posts_columns', 'insignia_team_columns' );


function insignia_team_custom_column( $column, $post_id ) {
	switch ( $column ) {
		case 'post_id':
			printf(
				'<span class="insignia-copy-id" data-id="%1$s" title="%2$s">%1$s</span>',
				esc_attr( $post_id ),
				esc_attr__( 'Click to copy ID', 'insignia' )
			);
			break;

		case 'team_designation':
			echo esc_html( get_post_meta( $post_id, '_team_designation', true ) );
			break;

		case 'team_linkedin':
			$linkedin = get_post_meta( $post_id, '_team_linkedin', true );
			if ( $linkedin ) {
				echo '<a href="' . esc_url( $linkedin ) . '" target="_blank" rel="noopener">' . esc_html__( 'View Profile', 'insignia' ) . '</a>';
			}
			break;
	}
}
add_action( 'manage_team_posts_custom_column', 'insignia_team_custom_column', 10, 2 );


function insignia_team_admin_assets( $hook ) {
	global $post_type;

	if ( 'edit.php' !== $hook || 'team' !== $post_type ) {
		return;
	}

	echo '<style>
		.column-post_id { width: 56px; text-align: center; }
		.insignia-copy-id {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-width: 36px;
			padding: 2px 8px;
			background: #f0f0f1;
			border: 1px solid #c3c4c7;
			border-radius: 3px;
			font-size: 12px;
			font-family: monospace;
			cursor: pointer;
			user-select: none;
			transition: background 0.15s, color 0.15s;
		}
		.insignia-copy-id:hover     { background: #dcdcde; }
		.insignia-copy-id.is-copied { background: #00a32a; color: #fff; border-color: #00a32a; }
	</style>';
}
add_action( 'admin_head', 'insignia_team_admin_assets' );


function insignia_team_copy_id_script( $hook ) {
	global $post_type;

	if ( 'edit.php' !== $hook || 'team' !== $post_type ) {
		return;
	}

	echo "<script>
		document.addEventListener( 'DOMContentLoaded', function () {
			document.querySelectorAll( '.insignia-copy-id' ).forEach( function ( badge ) {
				badge.addEventListener( 'click', function () {
					const id   = this.dataset.id;
					const self = this;

					const markCopied = () => {
						self.classList.add( 'is-copied' );
						self.textContent = 'Copied!';
						setTimeout( () => {
							self.classList.remove( 'is-copied' );
							self.textContent = id;
						}, 1500 );
					};

					if ( navigator.clipboard && window.isSecureContext ) {
						navigator.clipboard.writeText( id ).then( markCopied );
					} else {
						const el = document.createElement( 'input' );
						el.value = id;
						el.style.cssText = 'position:absolute;left:-9999px;top:-9999px';
						document.body.appendChild( el );
						el.select();
						document.execCommand( 'copy' );
						document.body.removeChild( el );
						markCopied();
					}
				} );
			} );
		} );
	</script>";
}
add_action( 'admin_footer', 'insignia_team_copy_id_script' );
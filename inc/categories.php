<?php
/**
 * Block & Pattern Categories
 *
 * Registers custom block categories and block pattern categories
 * used throughout this theme.
 *
 * @package Insignia_FSE
 */

if ( ! function_exists( 'insigniafse_block_categories' ) ) :
	/**
	 * Adds the "Brilliant Blocks" category to the block inserter.
	 *
	 * @param  array                   $block_categories     Existing block categories.
	 * @param  WP_Block_Editor_Context $block_editor_context Current editor context.
	 * @return array
	 */
	function insigniafse_block_categories( $block_categories, $block_editor_context ) {
		return array_merge(
			array(
				array(
					'slug'  => 'insignia-blocks',
					'title' => __( 'Insignia Blocks', 'insignia' ),
				),
			),
			$block_categories

		);
	}
endif;
add_filter( 'block_categories_all', 'insigniafse_block_categories', 10, 2 );


if ( ! function_exists( 'insigniafse_pattern_categories' ) ) :
	/**
	 * Registers the "Insignia" block pattern category.
	 */
	function insigniafse_pattern_categories() {
		register_block_pattern_category(
			'insignia_fse',
			array(
				'label'       => __( 'Insignia', 'insignia' ),
				'description' => __( 'A collection of Insignia patterns.', 'insignia' ),
			)
		);
	}
endif;
add_action( 'init', 'insigniafse_pattern_categories' );

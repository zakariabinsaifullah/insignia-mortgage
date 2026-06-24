<?php
/**
 * Asset Enqueueing
 *
 * Registers and enqueues stylesheets and scripts for the front end
 * and the block editor.
 *
 * @package Insignia_FSE
 */

if ( ! function_exists( 'insigniafse_enqueue_styles' ) ) :
	/**
	 * Enqueues the theme stylesheets on the front end and registers
	 * shared vendor assets (Swiper) that blocks can depend on.
	 */
	function insigniafse_enqueue_styles() {
		$theme_version = INSA_THEME_VERSION;

		wp_enqueue_style(
			'insignia-root-style',
			get_parent_theme_file_uri( 'style.css' ),
			array(),
			$theme_version
		);

		// Register Swiper so blocks can declare it as a dependency.
		wp_register_style(
			'insignia-swiper-style',
			get_parent_theme_file_uri( 'assets/css/swiper-bundle.min.css' ),
			array(),
			$theme_version
		);

		wp_register_script(
			'insignia-swiper-script',
			get_parent_theme_file_uri( 'assets/js/swiper-bundle.min.js' ),
			array(),
			$theme_version,
			true
		);
	}
endif;
add_action( 'wp_enqueue_scripts', 'insigniafse_enqueue_styles' );


if ( ! function_exists( 'insigniafse_enqueue_block_styles' ) ) :
	/**
	 * Enqueues the shared block stylesheet in both the editor and on the front end.
	 */
	function insigniafse_enqueue_block_styles() {
		wp_enqueue_style(
			'insignia-block-style',
			get_parent_theme_file_uri( 'assets/css/blocks.css' ),
			array(),
			INSA_THEME_VERSION
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insigniafse_enqueue_block_styles' );

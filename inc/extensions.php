<?php
/**
 * Block Editor Extensions
 *
 * Enqueues assets for block editor extensions that live in build/extensions/.
 * Extensions are different from custom blocks — they extend existing blocks
 * rather than registering new block types.
 *
 * @package Insignia_FSE
 */

if ( ! function_exists( 'insignia_enqueue_hover_color_editor_assets' ) ) :
	/**
	 * Enqueues the hover-color extension script and editor stylesheet.
	 * Runs on `enqueue_block_editor_assets` (editor only).
	 */
	function insignia_enqueue_hover_color_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/hover-color/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-hover-color-extension',
			get_theme_file_uri( 'build/extensions/hover-color/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);

		$editor_css = get_theme_file_path( 'build/extensions/hover-color/index.css' );
		if ( file_exists( $editor_css ) ) {
			wp_enqueue_style(
				'insignia-hover-color-extension',
				get_theme_file_uri( 'build/extensions/hover-color/index.css' ),
				array(),
				$assets['version']
			);
		}
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_hover_color_editor_assets' );


if ( ! function_exists( 'insignia_enqueue_hover_color_frontend_assets' ) ) :
	/**
	 * Enqueues the hover-color extension frontend stylesheet.
	 * Runs on `enqueue_block_assets` (editor + front end).
	 */
	function insignia_enqueue_hover_color_frontend_assets() {
		$asset_file  = get_theme_file_path( 'build/extensions/hover-color/index.asset.php' );
		$style_file  = get_theme_file_path( 'build/extensions/hover-color/style-index.css' );

		if ( ! file_exists( $asset_file ) || ! file_exists( $style_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_style(
			'insignia-hover-color-extension-style',
			get_theme_file_uri( 'build/extensions/hover-color/style-index.css' ),
			array(),
			$assets['version']
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insignia_enqueue_hover_color_frontend_assets' );


if ( ! function_exists( 'insignia_render_hover_color_attributes' ) ) :
	/**
	 * Injects hover-color CSS classes and custom properties into block HTML on the frontend.
	 *
	 * The editor applies these via the JS `editor.BlockListBlock` filter, which has no effect
	 * on saved frontend markup. This PHP `render_block` filter replicates that logic so the
	 * CSS variables and classes are present in the rendered HTML.
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_hover_color_attributes( $block_content, $block ) {
		if ( empty( $block_content ) ) {
			return $block_content;
		}

		$attrs = $block['attrs'] ?? array();

		$hover_text_color              = $attrs['hoverTextColor'] ?? '';
		$custom_hover_text_color       = $attrs['customHoverTextColor'] ?? '';
		$hover_background_color        = $attrs['hoverBackgroundColor'] ?? '';
		$custom_hover_background_color = $attrs['customHoverBackgroundColor'] ?? '';
		$hover_background_gradient     = $attrs['hoverBackgroundGradient'] ?? '';
		$hover_border_color            = $attrs['hoverBorderColor'] ?? '';
		$custom_hover_border_color     = $attrs['customHoverBorderColor'] ?? '';
		$hover_transition_duration     = $attrs['hoverTransitionDuration'] ?? 200;
		$hover_transition_timing       = $attrs['hoverTransitionTiming'] ?? 'ease';

		$has_hover_text       = $hover_text_color || $custom_hover_text_color;
		$has_hover_bg_color   = $hover_background_color || $custom_hover_background_color;
		$has_hover_bg_gradient = (bool) $hover_background_gradient;
		$has_hover_border     = $hover_border_color || $custom_hover_border_color;

		if ( ! $has_hover_text && ! $has_hover_bg_color && ! $has_hover_bg_gradient && ! $has_hover_border ) {
			return $block_content;
		}

		$get_color_value = function( $preset, $custom ) {
			if ( $preset ) {
				return 'var(--wp--preset--color--' . $preset . ')';
			}
			return $custom ?: '';
		};

		// Build CSS custom properties string.
		$css_vars = array();
		if ( $has_hover_text ) {
			$css_vars[] = '--hover-color:' . $get_color_value( $hover_text_color, $custom_hover_text_color );
		}
		if ( $has_hover_bg_color ) {
			$css_vars[] = '--hover-background-color:' . $get_color_value( $hover_background_color, $custom_hover_background_color );
		}
		if ( $has_hover_bg_gradient ) {
			$css_vars[] = '--hover-background-gradient:' . $hover_background_gradient;
		}
		if ( $has_hover_border ) {
			$css_vars[] = '--hover-border-color:' . $get_color_value( $hover_border_color, $custom_hover_border_color );
		}
		$css_vars[] = '--hover-transition-duration:' . intval( $hover_transition_duration ) . 'ms';
		$css_vars[] = '--hover-transition-timing:' . $hover_transition_timing;

		// Build class list.
		$new_classes = array();
		if ( $has_hover_text ) {
			$new_classes[] = 'has-hover__color';
		}
		if ( $has_hover_bg_color ) {
			$new_classes[] = 'has-hover__background-color';
		}
		if ( $has_hover_bg_gradient ) {
			$new_classes[] = 'has-hover__background-gradient';
		}
		if ( $has_hover_border ) {
			$new_classes[] = 'has-hover__border-color';
		}

		// Use WP_HTML_Tag_Processor (WP 6.2+) for safe attribute manipulation.
		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			// Append classes.
			foreach ( $new_classes as $class ) {
				$processor->add_class( $class );
			}

			// Merge CSS variables into the existing style attribute.
			$existing_style = $processor->get_attribute( 'style' ) ?? '';
			$new_style      = rtrim( $existing_style, '; ' );
			if ( $new_style ) {
				$new_style .= ';';
			}
			$new_style .= implode( ';', $css_vars );
			$processor->set_attribute( 'style', $new_style );

			return $processor->get_updated_html();
		}

		return $block_content;
	}
endif;
add_filter( 'render_block', 'insignia_render_hover_color_attributes', 10, 2 );


// =============================================================================
// Group – Force Full Height Extension
// =============================================================================

if ( ! function_exists( 'insignia_enqueue_group_full_height_editor_assets' ) ) :
	/**
	 * Enqueues the group-full-height extension script and editor stylesheet.
	 * Runs on `enqueue_block_editor_assets` (editor only).
	 */
	function insignia_enqueue_group_full_height_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-full-height/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-group-full-height-extension',
			get_theme_file_uri( 'build/extensions/group-full-height/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);

		$editor_css = get_theme_file_path( 'build/extensions/group-full-height/index.css' );
		if ( file_exists( $editor_css ) ) {
			wp_enqueue_style(
				'insignia-group-full-height-extension',
				get_theme_file_uri( 'build/extensions/group-full-height/index.css' ),
				array(),
				$assets['version']
			);
		}
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_group_full_height_editor_assets' );


if ( ! function_exists( 'insignia_enqueue_group_full_height_frontend_assets' ) ) :
	/**
	 * Enqueues the group-full-height frontend stylesheet.
	 * Runs on `enqueue_block_assets` (editor + front end).
	 */
	function insignia_enqueue_group_full_height_frontend_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-full-height/index.asset.php' );
		$style_file = get_theme_file_path( 'build/extensions/group-full-height/style-index.css' );

		if ( ! file_exists( $asset_file ) || ! file_exists( $style_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_style(
			'insignia-group-full-height-extension-style',
			get_theme_file_uri( 'build/extensions/group-full-height/style-index.css' ),
			array(),
			$assets['version']
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insignia_enqueue_group_full_height_frontend_assets' );


if ( ! function_exists( 'insignia_render_group_full_height' ) ) :
	/**
	 * Injects the `has-force-full-height` class into core/group blocks on the frontend
	 * when the `forceFullHeight` attribute is enabled.
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including name and attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_group_full_height( $block_content, $block ) {
		if ( 'core/group' !== $block['blockName'] ) {
			return $block_content;
		}

		if ( empty( $block['attrs']['forceFullHeight'] ) ) {
			return $block_content;
		}

		if ( empty( $block_content ) ) {
			return $block_content;
		}

		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->add_class( 'has-force-full-height' );
			return $processor->get_updated_html();
		}

		return $block_content;
	}
endif;
add_filter( 'render_block', 'insignia_render_group_full_height', 10, 2 );


// =============================================================================
// Group – Overlay Background Extension
// =============================================================================

if ( ! function_exists( 'insignia_enqueue_group_overlay_bg_editor_assets' ) ) :
	/**
	 * Enqueues the group-overlay-bg extension script and editor stylesheet.
	 * Runs on `enqueue_block_editor_assets` (editor only).
	 */
	function insignia_enqueue_group_overlay_bg_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-overlay-bg/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-group-overlay-bg-extension',
			get_theme_file_uri( 'build/extensions/group-overlay-bg/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);

		$editor_css = get_theme_file_path( 'build/extensions/group-overlay-bg/index.css' );
		if ( file_exists( $editor_css ) ) {
			wp_enqueue_style(
				'insignia-group-overlay-bg-extension',
				get_theme_file_uri( 'build/extensions/group-overlay-bg/index.css' ),
				array(),
				$assets['version']
			);
		}
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_group_overlay_bg_editor_assets' );


if ( ! function_exists( 'insignia_enqueue_group_overlay_bg_frontend_assets' ) ) :
	/**
	 * Enqueues the group-overlay-bg frontend stylesheet.
	 * Runs on `enqueue_block_assets` (editor + front end).
	 */
	function insignia_enqueue_group_overlay_bg_frontend_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-overlay-bg/index.asset.php' );
		$style_file = get_theme_file_path( 'build/extensions/group-overlay-bg/style-index.css' );

		if ( ! file_exists( $asset_file ) || ! file_exists( $style_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_style(
			'insignia-group-overlay-bg-extension-style',
			get_theme_file_uri( 'build/extensions/group-overlay-bg/style-index.css' ),
			array(),
			$assets['version']
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insignia_enqueue_group_overlay_bg_frontend_assets' );


if ( ! function_exists( 'insignia_render_group_overlay_bg' ) ) :
	/**
	 * Injects the `blnt-overlay-bg` class and `--blnt-overlay-bg` CSS custom property
	 * into core/group blocks on the frontend when an overlay background is set.
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including name and attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_group_overlay_bg( $block_content, $block ) {
		if ( 'core/group' !== $block['blockName'] ) {
			return $block_content;
		}

		$attrs                  = $block['attrs'] ?? array();
		$overlay_bg_color       = $attrs['overlayBgColor'] ?? '';
		$custom_overlay_bg_color = $attrs['customOverlayBgColor'] ?? '';
		$overlay_bg_gradient    = $attrs['overlayBgGradient'] ?? '';

		if ( ! $overlay_bg_color && ! $custom_overlay_bg_color && ! $overlay_bg_gradient ) {
			return $block_content;
		}

		if ( empty( $block_content ) ) {
			return $block_content;
		}

		if ( $overlay_bg_gradient ) {
			$bg_value = $overlay_bg_gradient;
		} elseif ( $overlay_bg_color ) {
			$bg_value = 'var(--wp--preset--color--' . $overlay_bg_color . ')';
		} else {
			$bg_value = $custom_overlay_bg_color;
		}

		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->add_class( 'blnt-overlay-bg' );

			$existing_style = $processor->get_attribute( 'style' ) ?? '';
			$new_style      = rtrim( $existing_style, '; ' );
			if ( $new_style ) {
				$new_style .= ';';
			}
			$new_style .= '--blnt-overlay-bg:' . $bg_value;
			$processor->set_attribute( 'style', $new_style );

			return $processor->get_updated_html();
		}

		return $block_content;
	}
endif;
add_filter( 'render_block', 'insignia_render_group_overlay_bg', 10, 2 );


// =============================================================================
// Group – Global Hover Extension
// =============================================================================

if ( ! function_exists( 'insignia_enqueue_group_global_hover_editor_assets' ) ) :
	/**
	 * Enqueues the group-global-hover extension script and editor stylesheet.
	 * Runs on `enqueue_block_editor_assets` (editor only).
	 */
	function insignia_enqueue_group_global_hover_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-global-hover/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-group-global-hover-extension',
			get_theme_file_uri( 'build/extensions/group-global-hover/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);

		$editor_css = get_theme_file_path( 'build/extensions/group-global-hover/index.css' );
		if ( file_exists( $editor_css ) ) {
			wp_enqueue_style(
				'insignia-group-global-hover-extension',
				get_theme_file_uri( 'build/extensions/group-global-hover/index.css' ),
				array(),
				$assets['version']
			);
		}
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_group_global_hover_editor_assets' );


if ( ! function_exists( 'insignia_enqueue_group_global_hover_frontend_assets' ) ) :
	/**
	 * Enqueues the group-global-hover frontend stylesheet.
	 * Runs on `enqueue_block_assets` (editor + front end).
	 */
	function insignia_enqueue_group_global_hover_frontend_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-global-hover/index.asset.php' );
		$style_file = get_theme_file_path( 'build/extensions/group-global-hover/style-index.css' );

		if ( ! file_exists( $asset_file ) || ! file_exists( $style_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_style(
			'insignia-group-global-hover-extension-style',
			get_theme_file_uri( 'build/extensions/group-global-hover/style-index.css' ),
			array(),
			$assets['version']
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insignia_enqueue_group_global_hover_frontend_assets' );


if ( ! function_exists( 'insignia_render_group_global_hover' ) ) :
	/**
	 * Injects `blnt-global-hover` class + CSS variables into core/group blocks on the
	 * frontend when the global hover feature is enabled.
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including name and attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_group_global_hover( $block_content, $block ) {
		if ( 'core/group' !== $block['blockName'] ) {
			return $block_content;
		}

		$attrs = $block['attrs'] ?? array();

		if ( empty( $attrs['globalHoverEnabled'] ) ) {
			return $block_content;
		}

		$bg_color        = $attrs['globalHoverBgColor'] ?? '';
		$custom_bg_color = $attrs['customGlobalHoverBgColor'] ?? '';
		$bg_gradient     = $attrs['globalHoverBgGradient'] ?? '';
		$color           = $attrs['globalHoverColor'] ?? '';
		$custom_color    = $attrs['customGlobalHoverColor'] ?? '';

		$has_bg    = $bg_color || $custom_bg_color || $bg_gradient;
		$has_color = $color || $custom_color;

		if ( ! $has_bg && ! $has_color ) {
			return $block_content;
		}

		if ( empty( $block_content ) ) {
			return $block_content;
		}

		$css_vars = array();

		if ( $has_bg ) {
			if ( $bg_gradient ) {
				$bg_value = $bg_gradient;
			} elseif ( $bg_color ) {
				$bg_value = 'var(--wp--preset--color--' . $bg_color . ')';
			} else {
				$bg_value = $custom_bg_color;
			}
			$css_vars[] = '--blnt-ghover-bg:' . $bg_value;
		}

		if ( $has_color ) {
			$color_value = $color
				? 'var(--wp--preset--color--' . $color . ')'
				: $custom_color;
			$css_vars[] = '--blnt-ghover-color:' . $color_value;
		}

		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->add_class( 'blnt-global-hover' );

			$existing_style = $processor->get_attribute( 'style' ) ?? '';
			$new_style      = rtrim( $existing_style, '; ' );
			if ( $new_style ) {
				$new_style .= ';';
			}
			$new_style .= implode( ';', $css_vars );
			$processor->set_attribute( 'style', $new_style );

			return $processor->get_updated_html();
		}

		return $block_content;
	}
endif;
add_filter( 'render_block', 'insignia_render_group_global_hover', 10, 2 );

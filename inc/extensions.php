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
	 * Injects the `insa-overlay-bg` class and `--insa-overlay-bg` CSS custom property
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
			$processor->add_class( 'insa-overlay-bg' );

			$existing_style = $processor->get_attribute( 'style' ) ?? '';
			$new_style      = rtrim( $existing_style, '; ' );
			if ( $new_style ) {
				$new_style .= ';';
			}
			$new_style .= '--insa-overlay-bg:' . $bg_value;
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
	 * Injects `insa-global-hover` class + CSS variables into core/group blocks on the
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
			$css_vars[] = '--insa-ghover-bg:' . $bg_value;
		}

		if ( $has_color ) {
			$color_value = $color
				? 'var(--wp--preset--color--' . $color . ')'
				: $custom_color;
			$css_vars[] = '--insa-ghover-color:' . $color_value;
		}

		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->add_class( 'insa-global-hover' );

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


// =============================================================================
// Heading – Arrow Style Extension
// =============================================================================

if ( ! function_exists( 'insignia_enqueue_heading_arrow_editor_assets' ) ) :
	/**
	 * Enqueues the heading-arrow extension script in the editor.
	 * Provides alignment + size controls when the "Arrow" block style is active.
	 */
	function insignia_enqueue_heading_arrow_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/heading-arrow/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-heading-arrow-extension',
			get_theme_file_uri( 'build/extensions/heading-arrow/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_heading_arrow_editor_assets' );


if ( ! function_exists( 'insignia_render_heading_arrow' ) ) :
	/**
	 * Injects CSS custom properties for arrow size and alignment into heading blocks
	 * on the frontend when the "Arrow" block style is active.
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including name and attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_heading_arrow( $block_content, $block ) {
		if ( 'core/heading' !== $block['blockName'] ) {
			return $block_content;
		}

		$attrs      = $block['attrs'] ?? array();
		$class_name = $attrs['className'] ?? '';

		if ( false === strpos( $class_name, 'is-style-arrow' ) || empty( $block_content ) ) {
			return $block_content;
		}

		$arrow_align = $attrs['arrowAlign'] ?? 'left';
		$arrow_size  = isset( $attrs['arrowSize'] ) ? intval( $attrs['arrowSize'] ) : 35;
		$is_center   = 'center' === $arrow_align;

		$css_vars  = '--arrow-size:' . $arrow_size . 'px;';
		$css_vars .= '--arrow-align-x:' . ( $is_center ? '50%' : '0' ) . ';';
		$css_vars .= '--arrow-align-transform:' . ( $is_center ? 'translateX(-50%)' : 'none' );

		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$existing_style = $processor->get_attribute( 'style' ) ?? '';
			$new_style      = rtrim( $existing_style, '; ' );
			if ( $new_style ) {
				$new_style .= ';';
			}
			$new_style .= $css_vars;
			$processor->set_attribute( 'style', $new_style );

			return $processor->get_updated_html();
		}

		return $block_content;
	}
endif;
add_filter( 'render_block', 'insignia_render_heading_arrow', 10, 2 );


// =============================================================================
// Group – Overlay Ellipse Extension
// =============================================================================

if ( ! function_exists( 'insignia_enqueue_group_overlay_ellipse_editor_assets' ) ) :
	/**
	 * Enqueues the group-overlay-ellipse extension script and editor stylesheet.
	 */
	function insignia_enqueue_group_overlay_ellipse_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-overlay-ellipse/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-group-overlay-ellipse-extension',
			get_theme_file_uri( 'build/extensions/group-overlay-ellipse/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);

		$editor_css = get_theme_file_path( 'build/extensions/group-overlay-ellipse/index.css' );
		if ( file_exists( $editor_css ) ) {
			wp_enqueue_style(
				'insignia-group-overlay-ellipse-extension',
				get_theme_file_uri( 'build/extensions/group-overlay-ellipse/index.css' ),
				array(),
				$assets['version']
			);
		}
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_group_overlay_ellipse_editor_assets' );


if ( ! function_exists( 'insignia_enqueue_group_overlay_ellipse_frontend_assets' ) ) :
	/**
	 * Enqueues the group-overlay-ellipse frontend stylesheet.
	 */
	function insignia_enqueue_group_overlay_ellipse_frontend_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-overlay-ellipse/index.asset.php' );
		$style_file = get_theme_file_path( 'build/extensions/group-overlay-ellipse/style-index.css' );

		if ( ! file_exists( $asset_file ) || ! file_exists( $style_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_style(
			'insignia-group-overlay-ellipse-extension-style',
			get_theme_file_uri( 'build/extensions/group-overlay-ellipse/style-index.css' ),
			array(),
			$assets['version']
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insignia_enqueue_group_overlay_ellipse_frontend_assets' );


if ( ! function_exists( 'insignia_render_group_overlay_ellipse' ) ) :
	/**
	 * Injects overlay ellipse classes into core/group blocks on the frontend.
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including name and attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_group_overlay_ellipse( $block_content, $block ) {
		$supported = array( 'core/group' );
		if ( ! in_array( $block['blockName'], $supported, true ) || empty( $block_content ) ) {
			return $block_content;
		}

		$attrs   = $block['attrs'] ?? array();
		$ellipse = $attrs['overlayEllipse'] ?? 'none';

		if ( 'none' === $ellipse || empty( $ellipse ) ) {
			return $block_content;
		}

		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->add_class( 'has-overlay-ellipse' );
			$processor->add_class( 'has-overlay-ellipse--' . sanitize_html_class( $ellipse ) );
			return $processor->get_updated_html();
		}

		return $block_content;
	}
endif;
add_filter( 'render_block', 'insignia_render_group_overlay_ellipse', 10, 2 );


// =============================================================================
// Group – Floating Border Extension
// =============================================================================

if ( ! function_exists( 'insignia_enqueue_group_floating_border_editor_assets' ) ) :
	/**
	 * Enqueues the group-floating-border extension script and editor stylesheet.
	 */
	function insignia_enqueue_group_floating_border_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-floating-border/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-group-floating-border-extension',
			get_theme_file_uri( 'build/extensions/group-floating-border/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);

		$editor_css = get_theme_file_path( 'build/extensions/group-floating-border/index.css' );
		if ( file_exists( $editor_css ) ) {
			wp_enqueue_style(
				'insignia-group-floating-border-extension',
				get_theme_file_uri( 'build/extensions/group-floating-border/index.css' ),
				array(),
				$assets['version']
			);
		}
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_group_floating_border_editor_assets' );


if ( ! function_exists( 'insignia_enqueue_group_floating_border_frontend_assets' ) ) :
	/**
	 * Enqueues the group-floating-border frontend stylesheet.
	 */
	function insignia_enqueue_group_floating_border_frontend_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/group-floating-border/index.asset.php' );
		$style_file = get_theme_file_path( 'build/extensions/group-floating-border/style-index.css' );

		if ( ! file_exists( $asset_file ) || ! file_exists( $style_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_style(
			'insignia-group-floating-border-extension-style',
			get_theme_file_uri( 'build/extensions/group-floating-border/style-index.css' ),
			array(),
			$assets['version']
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insignia_enqueue_group_floating_border_frontend_assets' );


if ( ! function_exists( 'insignia_render_group_floating_border' ) ) :
	/**
	 * Injects floating border CSS variables and classes into supported blocks on the frontend.
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including name and attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_group_floating_border( $block_content, $block ) {
		$supported = array( 'core/group', 'kadence/rowlayout' );
		if ( ! in_array( $block['blockName'], $supported, true ) || empty( $block_content ) ) {
			return $block_content;
		}

		$attrs = $block['attrs'] ?? array();

		$border1_enabled = ! empty( $attrs['floatingBorder1Enabled'] );
		$border2_enabled = ! empty( $attrs['floatingBorder2Enabled'] );

		if ( ! $border1_enabled && ! $border2_enabled ) {
			return $block_content;
		}

		$new_classes = array();
		$css_vars    = array();
		$fields      = array( 'Width', 'Height', 'Color', 'Top', 'Right', 'Bottom', 'Left' );

		if ( $border1_enabled ) {
			$new_classes[] = 'has-floating-border-1';
			foreach ( $fields as $field ) {
				$val = $attrs[ 'floatingBorder1' . $field ] ?? '';
				if ( '' !== $val ) {
					$css_vars[] = '--fb1-' . strtolower( $field ) . ':' . esc_attr( $val );
				}
			}
		}

		if ( $border2_enabled ) {
			$new_classes[] = 'has-floating-border-2';
			foreach ( $fields as $field ) {
				$val = $attrs[ 'floatingBorder2' . $field ] ?? '';
				if ( '' !== $val ) {
					$css_vars[] = '--fb2-' . strtolower( $field ) . ':' . esc_attr( $val );
				}
			}
		}

		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			foreach ( $new_classes as $class ) {
				$processor->add_class( $class );
			}
			if ( $css_vars ) {
				$existing_style = $processor->get_attribute( 'style' ) ?? '';
				$new_style      = rtrim( $existing_style, '; ' );
				if ( $new_style ) {
					$new_style .= ';';
				}
				$new_style .= implode( ';', $css_vars );
				$processor->set_attribute( 'style', $new_style );
			}
			return $processor->get_updated_html();
		}

		return $block_content;
	}
endif;
add_filter( 'render_block', 'insignia_render_group_floating_border', 10, 2 );


// =============================================================================
// Heading & Paragraph – Max Width Extension
// =============================================================================

if ( ! function_exists( 'insignia_enqueue_text_max_width_editor_assets' ) ) :
	/**
	 * Enqueues the text-max-width extension script and editor stylesheet.
	 * Runs on `enqueue_block_editor_assets` (editor only).
	 */
	function insignia_enqueue_text_max_width_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/text-max-width/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-text-max-width-extension',
			get_theme_file_uri( 'build/extensions/text-max-width/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);

		$editor_css = get_theme_file_path( 'build/extensions/text-max-width/index.css' );
		if ( file_exists( $editor_css ) ) {
			wp_enqueue_style(
				'insignia-text-max-width-extension',
				get_theme_file_uri( 'build/extensions/text-max-width/index.css' ),
				array(),
				$assets['version']
			);
		}
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_text_max_width_editor_assets' );


if ( ! function_exists( 'insignia_enqueue_text_max_width_frontend_assets' ) ) :
	/**
	 * Enqueues the text-max-width frontend stylesheet.
	 * Runs on `enqueue_block_assets` (editor + front end).
	 */
	function insignia_enqueue_text_max_width_frontend_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/text-max-width/index.asset.php' );
		$style_file = get_theme_file_path( 'build/extensions/text-max-width/style-index.css' );

		if ( ! file_exists( $asset_file ) || ! file_exists( $style_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_style(
			'insignia-text-max-width-extension-style',
			get_theme_file_uri( 'build/extensions/text-max-width/style-index.css' ),
			array(),
			$assets['version']
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insignia_enqueue_text_max_width_frontend_assets' );


if ( ! function_exists( 'insignia_render_text_max_width' ) ) :
	/**
	 * Injects the `has-max-width` class and `--max-width` CSS custom property
	 * into supported blocks on the frontend when the maxWidth attribute is set.
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including name and attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_text_max_width( $block_content, $block ) {
		$supported = array( 'core/heading', 'core/paragraph' );

		if ( ! in_array( $block['blockName'], $supported, true ) ) {
			return $block_content;
		}

		$attrs = $block['attrs'] ?? array();

		if ( empty( $attrs['maxWidth'] ) ) {
			return $block_content;
		}

		if ( empty( $block_content ) ) {
			return $block_content;
		}

		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->add_class( 'has-max-width' );

			$existing_style = $processor->get_attribute( 'style' ) ?? '';
			$new_style      = rtrim( $existing_style, '; ' );
			if ( $new_style ) {
				$new_style .= ';';
			}
			$new_style .= '--max-width:' . intval( $attrs['maxWidth'] ) . 'px';
			$processor->set_attribute( 'style', $new_style );

			return $processor->get_updated_html();
		}

		return $block_content;
	}
endif;
add_filter( 'render_block', 'insignia_render_text_max_width', 10, 2 );


// =============================================================================
// Button – Full Width Mobile Extension
// =============================================================================

if ( ! function_exists( 'insignia_enqueue_button_full_width_mobile_editor_assets' ) ) :
	/**
	 * Enqueues the button-full-width-mobile extension script and editor stylesheet.
	 * Runs on `enqueue_block_editor_assets` (editor only).
	 */
	function insignia_enqueue_button_full_width_mobile_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/button-full-width-mobile/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-button-full-width-mobile-extension',
			get_theme_file_uri( 'build/extensions/button-full-width-mobile/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);

		$editor_css = get_theme_file_path( 'build/extensions/button-full-width-mobile/index.css' );
		if ( file_exists( $editor_css ) ) {
			wp_enqueue_style(
				'insignia-button-full-width-mobile-extension',
				get_theme_file_uri( 'build/extensions/button-full-width-mobile/index.css' ),
				array(),
				$assets['version']
			);
		}
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_button_full_width_mobile_editor_assets' );


if ( ! function_exists( 'insignia_enqueue_button_full_width_mobile_frontend_assets' ) ) :
	/**
	 * Enqueues the button-full-width-mobile frontend stylesheet.
	 * Runs on `enqueue_block_assets` (editor + front end).
	 */
	function insignia_enqueue_button_full_width_mobile_frontend_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/button-full-width-mobile/index.asset.php' );
		$style_file = get_theme_file_path( 'build/extensions/button-full-width-mobile/style-index.css' );

		if ( ! file_exists( $asset_file ) || ! file_exists( $style_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_style(
			'insignia-button-full-width-mobile-extension-style',
			get_theme_file_uri( 'build/extensions/button-full-width-mobile/style-index.css' ),
			array(),
			$assets['version']
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insignia_enqueue_button_full_width_mobile_frontend_assets' );


if ( ! function_exists( 'insignia_render_button_full_width_mobile' ) ) :
	/**
	 * Injects the `has-full-width-mobile` class into core/button blocks on the frontend
	 * when the `fullWidthMobile` attribute is enabled.
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including name and attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_button_full_width_mobile( $block_content, $block ) {
		if ( 'core/button' !== $block['blockName'] ) {
			return $block_content;
		}

		if ( empty( $block['attrs']['fullWidthMobile'] ) ) {
			return $block_content;
		}

		if ( empty( $block_content ) ) {
			return $block_content;
		}

		$processor = new WP_HTML_Tag_Processor( $block_content );
		if ( $processor->next_tag() ) {
			$processor->add_class( 'has-full-width-mobile' );
			return $processor->get_updated_html();
		}

		return $block_content;
	}
endif;
add_filter( 'render_block', 'insignia_render_button_full_width_mobile', 10, 2 );


// =============================================================================
// Query Carousel — Block Variation for core/query
// =============================================================================

if ( ! function_exists( 'insignia_enqueue_query_carousel_editor_assets' ) ) :
	/**
	 * Enqueues the query-carousel extension script and editor stylesheet.
	 * Runs on `enqueue_block_editor_assets` (editor only).
	 */
	function insignia_enqueue_query_carousel_editor_assets() {
		$asset_file = get_theme_file_path( 'build/extensions/query-carousel/index.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-query-carousel-extension',
			get_theme_file_uri( 'build/extensions/query-carousel/index.js' ),
			$assets['dependencies'],
			$assets['version'],
			true
		);

		$editor_css = get_theme_file_path( 'build/extensions/query-carousel/index.css' );
		if ( file_exists( $editor_css ) ) {
			wp_enqueue_style(
				'insignia-query-carousel-extension',
				get_theme_file_uri( 'build/extensions/query-carousel/index.css' ),
				array(),
				$assets['version']
			);
		}
	}
endif;
add_action( 'enqueue_block_editor_assets', 'insignia_enqueue_query_carousel_editor_assets' );


if ( ! function_exists( 'insignia_enqueue_query_carousel_frontend_assets' ) ) :
	/**
	 * Enqueues the query-carousel frontend stylesheet and Swiper assets
	 * only when a Query Carousel variation is present on the page.
	 * Runs on `wp_enqueue_scripts` with late priority so is_singular() etc. are available.
	 */
	function insignia_enqueue_query_carousel_frontend_assets() {
		$asset_file  = get_theme_file_path( 'build/extensions/query-carousel/index.asset.php' );
		$style_file  = get_theme_file_path( 'build/extensions/query-carousel/style-index.css' );

		if ( ! file_exists( $asset_file ) || ! file_exists( $style_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_style(
			'insignia-query-carousel-extension-style',
			get_theme_file_uri( 'build/extensions/query-carousel/style-index.css' ),
			array( 'insignia-swiper-style' ),
			$assets['version']
		);
	}
endif;
add_action( 'enqueue_block_assets', 'insignia_enqueue_query_carousel_frontend_assets' );


if ( ! function_exists( 'insignia_enqueue_query_carousel_view_script' ) ) :
	/**
	 * Enqueues the Swiper init script + Swiper library on the frontend
	 * only when a Query Carousel block is rendered.
	 */
	function insignia_enqueue_query_carousel_view_script() {
		if ( is_admin() ) {
			return;
		}

		$asset_file = get_theme_file_path( 'build/extensions/query-carousel/view.asset.php' );

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$assets = require $asset_file;

		wp_enqueue_script(
			'insignia-swiper-script',
			get_parent_theme_file_uri( 'assets/js/swiper-bundle.min.js' ),
			array(),
			wp_get_theme()->get( 'Version' ),
			true
		);

		wp_enqueue_script(
			'insignia-query-carousel-view',
			get_theme_file_uri( 'build/extensions/query-carousel/view.js' ),
			array( 'insignia-swiper-script' ),
			$assets['version'],
			true
		);
	}
endif;


if ( ! function_exists( 'insignia_render_query_carousel' ) ) :
	/**
	 * Transforms core/query Query Carousel variation output into Swiper markup.
	 *
	 * When the namespace attribute matches 'insignia/query-carousel', this filter:
	 * 1. Wraps the post template items in Swiper markup
	 * 2. Adds a controls wrapper containing pagination and navigation arrows
	 * 3. Adds data attributes for Swiper configuration
	 * 4. Enqueues Swiper assets
	 *
	 * @param string $block_content The rendered block HTML.
	 * @param array  $block         The block data including name and attributes.
	 * @return string Modified block HTML.
	 */
	function insignia_render_query_carousel( $block_content, $block ) {
		if ( 'core/query' !== $block['blockName'] ) {
			return $block_content;
		}

		$attrs = $block['attrs'] ?? array();

		if ( ( $attrs['namespace'] ?? '' ) !== 'insignia/query-carousel' ) {
			return $block_content;
		}

		if ( empty( $block_content ) ) {
			return $block_content;
		}

		// Enqueue Swiper and view script.
		insignia_enqueue_query_carousel_view_script();

		// ── Extract carousel attributes ────────────────────────────────────
		$columns   = $attrs['qcColumns'] ?? array( 'Desktop' => 3, 'Tablet' => 2, 'Mobile' => 1 );
		$gaps      = $attrs['qcGaps'] ?? array( 'Desktop' => 20, 'Tablet' => 15, 'Mobile' => 0 );
		$loop      = $attrs['qcLoop'] ?? true;
		$autoplay  = $attrs['qcAutoplay'] ?? false;
		$delay     = $attrs['qcDelay'] ?? 3000;
		$show_arrows     = $attrs['qcShowArrows'] ?? true;
		$show_pagination = $attrs['qcShowPagination'] ?? false;

		// ── Build Swiper options data attribute ────────────────────────────
		$swiper_options = wp_json_encode( array(
			'loop'     => $loop,
			'autoplay' => $autoplay ? array( 'delay' => $delay ) : false,
			'columns'  => $columns,
			'gaps'     => $gaps,
		) );

		// ── Build class names ───────────────────────────────────────────────
		$classes = array( 'insignia-query-carousel' );

		// ── Icon SVG ─────────────────────────────────────────────────────────
		$svg_prev = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>';
		$svg_next = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>';

		// ── Transform the HTML ──────────────────────────────────────────────
		// Replace <ul with <div class="swiper"><div class="swiper-wrapper">
		$transformed = preg_replace(
			'/<ul([^>]*class=["\'][^"\']*wp-block-post-template[^"\']*["\'][^>]*)>/',
			'<div class="swiper"><div class="swiper-wrapper">',
			$block_content
		);

		// If the preg_replace didn't match, try a more lenient pattern
		if ( $transformed === $block_content ) {
			$transformed = preg_replace(
				'/<ul([^>]*class=["\']([^"\']*)["\'][^>]*)>/',
				'<div class="swiper"><div class="swiper-wrapper">',
				$block_content
			);
		}

		// Change <li> to <div class="swiper-slide">
		$transformed = preg_replace(
			'/<li([^>]*)>/',
			'<div class="swiper-slide"$1>',
			$transformed
		);

		// Change </li> to </div>
		$transformed = str_replace( '</li>', '</div>', $transformed );

		// Close </ul> becomes </div></div>
		$transformed = preg_replace(
			'/<\/ul>/',
			'</div></div>',
			$transformed
		);

		// ── Build controls wrapper (pagination + nav arrows) ────────────────
		$controls_inner = '';
		if ( $show_pagination ) {
			$controls_inner .= '<div class="swiper-pagination"></div>';
		}
		if ( $show_arrows ) {
			$controls_inner .= '<div class="insignia-qc-nav-group">';
			$controls_inner .= '<div class="swiper-custom-prev gu-nav" aria-label="' . esc_attr__( 'Previous', 'insignia' ) . '">' . $svg_prev . '</div>';
			$controls_inner .= '<div class="swiper-custom-next gu-nav" aria-label="' . esc_attr__( 'Next', 'insignia' ) . '">' . $svg_next . '</div>';
			$controls_inner .= '</div>';
		}

		$controls_html = '';
		if ( $show_arrows || $show_pagination ) {
			$controls_html = '<div class="insignia-qc-controls">' . $controls_inner . '</div>';
		}

		// ── Add classes and data attribute to the outer wrapper ─────────────
		$processor = new WP_HTML_Tag_Processor( $transformed );
		if ( $processor->next_tag() ) {
			foreach ( $classes as $class ) {
				$processor->add_class( $class );
			}

			$processor->set_attribute( 'data-qc-options', $swiper_options );

			$transformed = $processor->get_updated_html();
		}

		// ── Append controls wrapper before the closing tag ──────────────────
		if ( $controls_html ) {
			$transformed = preg_replace(
				'/(<\/div>)\s*$/',
				$controls_html . '$1',
				$transformed,
				1
			);
		}

		return $transformed;
	}
endif;
add_filter( 'render_block', 'insignia_render_query_carousel', 10, 2 );

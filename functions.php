<?php
/**
 * Insignia Mortgage — Theme Functions
 *
 * This file is intentionally kept as a loader only.
 * All feature logic lives in the files under inc/.
 *
 * @link    https://developer.wordpress.org/themes/basics/theme-functions/
 * @package Insignia_Mortgage
 * @since   1.0
 */

// ── Existing features ──────────────────────────────────────────────────────────
require_once get_theme_file_path( 'inc/cpt.php' );        // Custom post types

// ── Theme setup ────────────────────────────────────────────────────────────────
require_once get_theme_file_path( 'inc/setup.php' );      // Post formats, editor style

// ── Asset enqueueing ───────────────────────────────────────────────────────────
require_once get_theme_file_path( 'inc/enqueue.php' );    // Frontend & block styles

// ── Blocks ─────────────────────────────────────────────────────────────────────
require_once get_theme_file_path( 'inc/blocks.php' );        // Custom block registration
require_once get_theme_file_path( 'inc/block-styles.php' );  // Core block style variations
require_once get_theme_file_path( 'inc/extensions.php' );    // Block editor extensions

// ── Editor taxonomy ────────────────────────────────────────────────────────────
require_once get_theme_file_path( 'inc/categories.php' ); // Block & pattern categories

// ── Block bindings ─────────────────────────────────────────────────────────────
require_once get_theme_file_path( 'inc/bindings.php' );   // Dynamic block data sources

// ── Form panel ─────────────────────────────────────────────────────────────────
require_once get_theme_file_path( 'inc/form.php' );       // Slide-in form panel & settings

// ── Shortcodes ─────────────────────────────────────────────────────────────────
require_once get_theme_file_path( 'inc/shortcode.php' );  // Posts grid shortcode

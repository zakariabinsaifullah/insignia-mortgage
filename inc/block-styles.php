<?php
/**
 * Core Block Styles
 *
 * Registers custom style variations for core (and third-party) blocks.
 *
 * @package Insignia_FSE
 */

if ( ! function_exists( 'insigniafse_block_styles' ) ) :
	/**
	 * Registers all custom block style variations for the theme.
	 */
	function insigniafse_block_styles() {

		// ── Button block ───────────────────────────────────────────────────────


		// ── Heading block ──────────────────────────────────────────────────────

		register_block_style(
			'core/heading',
			array(
				'name'         => 'arrow',
				'label'        => __( 'Arrow', 'insignia' ),
				'inline_style' => '
				.wp-block-heading.is-style-arrow {
					padding-top: calc(var(--arrow-size, 35px) * 0.629 + 12px);
					position: relative;
				}
				.wp-block-heading.is-style-arrow::before {
					content: "";
					display: block;
					background-image: url("data:image/svg+xml,%3Csvg width=\'35\' height=\'22\' viewBox=\'0 0 35 22\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M.271 8.1S0 8.23 0 8.616v3.472l17.5-8.1V0z\' fill=\'%2374af27\'/%3E%3Cpath d=\'M34.729 8.1s.271.13.271.515v3.472l-17.5-8.1V0z\' fill=\'%236a971f\'/%3E%3Cpath d=\'M.271 17.188S0 17.316 0 17.702v3.472l17.5-8.101V9.087z\' fill=\'%2374af27\'/%3E%3Cpath d=\'M34.729 17.188s.271.128.271.514v3.472l-17.5-8.1V9.086z\' fill=\'%236a971f\'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-size: contain;
					width: var(--arrow-size, 35px);
					height: calc(var(--arrow-size, 35px) * 0.629);
					position: absolute;
					top: 0;
					left: var(--arrow-align-x, 0);
					transform: var(--arrow-align-transform, none);
				}',
			)
		);

		// ── List block ─────────────────────────────────────────────────────────

		register_block_style(
			'core/list',
			array(
				'name'         => 'checkmark-list',
				'label'        => __( 'Checkmark', 'insignia' ),
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}
				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);

		// ── Third-party blocks ─────────────────────────────────────────────────

		// register_block_style(
		// 	'kadence/rowlayout',
		// 	array(
		// 		'name'  => 'radial-overlay',
		// 		'label' => __( 'Radial Overlay', 'insignia' ),
		// 	)
		// );

		// register_block_style(
		// 	'kadence/rowlayout',
		// 	array(
		// 		'name'  => 'bottom-overlay',
		// 		'label' => __( 'Bottom Overlay', 'insignia' ),
		// 	)
		// );
	}
endif;
add_action( 'init', 'insigniafse_block_styles' );

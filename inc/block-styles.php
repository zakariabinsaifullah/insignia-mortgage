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

		register_block_style(
			'core/button',
			array(
				'name'  => 'link',
				'label' => __( 'Link', 'insignia' ),
			)
		);

		register_block_style(
			'core/button',
			array(
				'name'  => 'outline',
				'label' => __( 'Outline', 'insignia' ),
			)
		);

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

		// ── Excerpt block ─────────────────────────────────────────────────────

		register_block_style(
			'core/post-excerpt',
			array(
				'name'         => 'iconic-read-more',
				'label'        => __( 'Iconic More', 'insignia' ),
				'inline_style' => '
				.wp-block-post-excerpt.is-style-iconic-read-more .wp-block-post-excerpt__more-link {
					display: inline-flex;
					align-items: center;
					gap: 0.4em;
					font-weight: 600;
					font-size: 16px;
				}
				.wp-block-post-excerpt.is-style-iconic-read-more .wp-block-post-excerpt__more-link::after {
					content: "";
					display: inline-block;
					width: 16px;
					height: 12px;
					background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNiAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUuNDY5IDcuNDUzIDkuMjggMTMuMzZjLS4zNTEuMzE3LS44NzkuMzE3LTEuMTk1LS4wMzUtLjMxNi0uMzUxLS4zMTYtLjg3OS4wMzUtMS4xOTVsNC42NzYtNC40NjVILjg0NEMuMzUyIDcuNjY0IDAgNy4zMTMgMCA2LjgyYzAtLjQ1Ny4zNTItLjg0My44NDQtLjg0M2gxMS45NTNMOC4xMiAxLjU0N0EuODQuODQgMCAwIDEgOC4wODYuMzUyLjg0Ljg0IDAgMCAxIDkuMjguMzE2bDYuMTg4IDUuOTA3Yy4xNzYuMTc1LjI4MS4zODYuMjgxLjU5N2EuODguODggMCAwIDEtLjI4MS42MzMiIGZpbGw9IiM1YzhjMWYiLz48L3N2Zz4=");
					background-repeat: no-repeat;
					background-size: contain;
					background-position: center;
					flex-shrink: 0;
				}
				',
			)
		);


		register_block_style(
			'core/post-content',
			array(
				'name'  => 'post-typo',
				'label' => __( 'Post Typography', 'insignia' ),
			)
		);
	}
endif;
add_action( 'init', 'insigniafse_block_styles' );

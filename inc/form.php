<?php
/**
 * Form Settings — admin page under Appearance menu.
 *
 * Options:
 *   brilliant_fse_phone_number    – Phone Number
 *   brilliant_fse_form_shortcode  – Form Shortcode
 *   brilliant_fse_form_title      – Panel heading
 *   brilliant_fse_form_description – Panel description paragraph
 *
 * @package Brilliant_FSE
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ── Enqueue front-end assets ───────────────────────────────────────────────────

add_action( 'wp_enqueue_scripts', 'brilliant_fse_form_panel_assets' );

function brilliant_fse_form_panel_assets() {
	$version = wp_get_theme()->get( 'Version' );

	wp_enqueue_style(
		'blnt-form-panel',
		get_theme_file_uri( 'assets/css/form-panel.css' ),
		array(),
		$version
	);

	wp_enqueue_script(
		'blnt-form-panel',
		get_theme_file_uri( 'assets/js/form-panel.js' ),
		array(),
		$version,
		true
	);
}

// ── Inject panel HTML into every page footer ───────────────────────────────────

add_action( 'wp_footer', 'brilliant_fse_form_panel_html' );

function brilliant_fse_form_panel_html() {
	$phone       = get_option( 'brilliant_fse_phone_number', '' );
	$shortcode   = get_option( 'brilliant_fse_form_shortcode', '' );
	$title       = get_option( 'brilliant_fse_form_title', 'Contact us' );
	$description = get_option( 'brilliant_fse_form_description', '' );

	// Don't render the panel if neither option is set.
	if ( ! $phone && ! $shortcode ) {
		return;
	}
	?>
	<div id="blnt-form-overlay" class="blnt-form-overlay" aria-hidden="true"></div>

	<div
		id="blnt-form-panel"
		class="blnt-form-panel"
		role="dialog"
		aria-modal="true"
		aria-label="<?php echo esc_attr( $title ? $title : __( 'Contact us', 'insignia' ) ); ?>"
		aria-hidden="true"
	>
		<div class="blnt-form-panel__header">
			<?php if ( $phone ) : ?>
			<a href="tel:<?php echo esc_attr( preg_replace( '/[^\d+]/', '', $phone ) ); ?>" class="blnt-form-panel__phone">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path d="M3.62 7.79C5.06 10.62 7.38 12.93 10.21 14.38L12.41 12.18C12.68 11.91 13.08 11.82 13.43 11.94C14.55 12.31 15.76 12.51 17 12.51C17.55 12.51 18 12.96 18 13.51V17C18 17.55 17.55 18 17 18C7.61 18 0 10.39 0 1C0 0.45 0.45 0 1 0H4.5C5.05 0 5.5 0.45 5.5 1C5.5 2.25 5.7 3.45 6.07 4.57C6.18 4.92 6.1 5.31 5.82 5.59L3.62 7.79Z" fill="currentColor"/>
				</svg>
				<?php echo esc_html( $phone ); ?>
			</a>
			<?php else : ?>
			<span></span>
			<?php endif; ?>

			<button class="blnt-form-panel__close" aria-label="<?php esc_attr_e( 'Close form', 'insignia' ); ?>">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
		</div>

		<div class="blnt-form-panel__body">
			<?php if ( $title ) : ?>
				<h2 class="blnt-form-panel__title"><?php echo esc_html( $title ); ?></h2>
			<?php endif; ?>

			<?php if ( $description ) : ?>
				<p class="blnt-form-panel__desc"><?php echo esc_html( $description ); ?></p>
			<?php endif; ?>

			<?php if ( $shortcode ) : ?>
				<?php echo do_shortcode( $shortcode ); ?>
			<?php endif; ?>
		</div>
	</div>
	<?php
}

// ── Register settings ──────────────────────────────────────────────────────────

add_action( 'admin_init', 'brilliant_fse_form_register_settings' );

function brilliant_fse_form_register_settings() {
	register_setting(
		'brilliant_fse_form_group',
		'brilliant_fse_phone_number',
		[
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'default'           => '',
		]
	);

	register_setting(
		'brilliant_fse_form_group',
		'brilliant_fse_form_shortcode',
		[
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'default'           => '',
		]
	);

	register_setting(
		'brilliant_fse_form_group',
		'brilliant_fse_form_title',
		[
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'default'           => 'Contact us',
		]
	);

	register_setting(
		'brilliant_fse_form_group',
		'brilliant_fse_form_description',
		[
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_textarea_field',
			'default'           => '',
		]
	);
}

// ── Add menu page under Appearance ────────────────────────────────────────────

add_action( 'admin_menu', 'brilliant_fse_form_add_menu' );

function brilliant_fse_form_add_menu() {
	add_theme_page(
		__( 'Form Settings', 'insignia' ),
		__( 'Form', 'insignia' ),
		'manage_options',
		'insignia-form',
		'brilliant_fse_form_render_page'
	);
}

// ── Render settings page ───────────────────────────────────────────────────────

function brilliant_fse_form_render_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Form Settings', 'insignia' ); ?></h1>

		<?php settings_errors( 'brilliant_fse_form_group' ); ?>

		<?php /* ── Trigger ID hint ── */ ?>
		<div style="
			background: #f0f6fc;
			border-left: 4px solid #2271b1;
			border-radius: 0 4px 4px 0;
			padding: 14px 18px;
			margin: 16px 0 24px;
			max-width: 600px;
		">
			<p style="margin: 0 0 8px; font-weight: 600; color: #1d2327;">
				<?php esc_html_e( 'How to open this form panel', 'insignia' ); ?>
			</p>
			<p style="margin: 0 0 10px; color: #3c434a; font-size: 13px;">
				<?php esc_html_e( 'Add the following ID as the href value on any link or button to open the slide-in form:', 'insignia' ); ?>
			</p>
			<div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
				<code id="blnt-trigger-id" style="
					background: #1d2327;
					color: #7dd3fc;
					padding: 6px 14px;
					border-radius: 4px;
					font-size: 14px;
					font-family: monospace;
					letter-spacing: 0.5px;
					user-select: all;
				">#blnt-form-panel</code>
				<button
					type="button"
					onclick="
						navigator.clipboard.writeText('#blnt-form-panel');
						this.textContent = '✓ Copied!';
						setTimeout(() => this.textContent = 'Copy', 2000);
					"
					style="
						background: #2271b1;
						color: #fff;
						border: none;
						border-radius: 4px;
						padding: 5px 14px;
						font-size: 13px;
						cursor: pointer;
					"
				><?php esc_html_e( 'Copy', 'insignia' ); ?></button>
			</div>
			<p style="margin: 10px 0 0; color: #646970; font-size: 12px;">
				<?php esc_html_e( 'Example:', 'insignia' ); ?>
				<code style="background:#eee; padding: 2px 6px; border-radius: 3px;">&lt;a href="#blnt-form-panel"&gt;Get in Touch&lt;/a&gt;</code>
			</p>
		</div>

		<form method="post" action="options.php">
			<?php settings_fields( 'brilliant_fse_form_group' ); ?>

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="brilliant_fse_phone_number">
							<?php esc_html_e( 'Phone Number', 'insignia' ); ?>
						</label>
					</th>
					<td>
						<input
							type="text"
							id="brilliant_fse_phone_number"
							name="brilliant_fse_phone_number"
							value="<?php echo esc_attr( get_option( 'brilliant_fse_phone_number' ) ); ?>"
							class="regular-text"
							placeholder="e.g. 818-408-7117"
						/>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="brilliant_fse_form_title">
							<?php esc_html_e( 'Form Title', 'insignia' ); ?>
						</label>
					</th>
					<td>
						<input
							type="text"
							id="brilliant_fse_form_title"
							name="brilliant_fse_form_title"
							value="<?php echo esc_attr( get_option( 'brilliant_fse_form_title', 'Contact us' ) ); ?>"
							class="regular-text"
							placeholder="<?php esc_attr_e( 'Contact us', 'insignia' ); ?>"
						/>
						<p class="description">
							<?php esc_html_e( 'Heading displayed at the top of the slide-in panel.', 'insignia' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="brilliant_fse_form_description">
							<?php esc_html_e( 'Form Description', 'insignia' ); ?>
						</label>
					</th>
					<td>
						<textarea
							id="brilliant_fse_form_description"
							name="brilliant_fse_form_description"
							class="regular-text"
							rows="4"
							placeholder="<?php esc_attr_e( 'We are here to help you...', 'insignia' ); ?>"
						><?php echo esc_textarea( get_option( 'brilliant_fse_form_description', '' ) ); ?></textarea>
						<p class="description">
							<?php esc_html_e( 'Short paragraph shown below the title inside the panel.', 'insignia' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="brilliant_fse_form_shortcode">
							<?php esc_html_e( 'Form Shortcode', 'insignia' ); ?>
						</label>
					</th>
					<td>
						<input
							type="text"
							id="brilliant_fse_form_shortcode"
							name="brilliant_fse_form_shortcode"
							value="<?php echo esc_attr( get_option( 'brilliant_fse_form_shortcode' ) ); ?>"
							class="regular-text"
						/>
						<p class="description">
							<?php esc_html_e( 'Enter the shortcode, e.g. [gravityform id="1" title="false"]', 'insignia' ); ?>
						</p>
					</td>
				</tr>
			</table>

			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

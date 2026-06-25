<?php
/**
 * Team Grid block render template.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner blocks content (unused).
 * @var WP_Block $block      Block instance.
 */

// ── Resolve attributes ─────────────────────────────────────────────────────────
$order_by     = $attributes['orderBy']    ?? 'menu_order';
$selected_ids = $attributes['selectedIds'] ?? '';
$block_style  = $attributes['blockStyle'] ?? [];
$card_style   = $attributes['cardStyle']  ?? 'style1';

// Parse comma-separated IDs into a clean array of positive integers.
$post_in = [];
if ( ! empty( trim( $selected_ids ) ) ) {
	$post_in = array_values(
		array_filter(
			array_map( 'absint', explode( ',', $selected_ids ) ),
			fn( $id ) => $id > 0
		)
	);
}

// ── Build the wrapper inline style from CSS custom properties ──────────────────
$style_parts = [];
foreach ( $block_style as $property => $value ) {
	if ( ! empty( $value ) ) {
		$style_parts[] = esc_attr( $property ) . ':' . esc_attr( $value );
	}
}
$inline_style = implode( ';', $style_parts );

$wrapper_attributes = get_block_wrapper_attributes(
	! empty( $inline_style ) ? [ 'style' => $inline_style ] : []
);

// ── Query team members ─────────────────────────────────────────────────────────
$query_args = [
	'post_type'      => 'team',
	'posts_per_page' => -1,
	'post_status'    => 'publish',
	'no_found_rows'  => true,
];

if ( ! empty( $post_in ) ) {
	$query_args['post__in'] = $post_in;
	$query_args['orderby']  = 'post__in';
} else {
	$query_args['orderby'] = $order_by;
	$query_args['order']   = 'ASC';
}

$members_query = new WP_Query( $query_args );

if ( ! $members_query->have_posts() ) {
	echo '<div ' . $wrapper_attributes . '>';
	echo '<p class="insignia-team-grid__empty">' . esc_html__( 'No team members found.', 'insignia' ) . '</p>';
	echo '</div>';
	return;
}

// ── First pass: collect per-member data and unique popup IDs ───────────────────
// We buffer the card markup so we can compute the JSON data once, then render
// the wrapper, the grid (cards), and the popup shell with all IDs known.
$members_data = [];
$cards_html   = [];

while ( $members_query->have_posts() ) {
	$members_query->the_post();

	$post_id         = get_the_ID();
	$name            = get_the_title();
	$designation     = get_post_meta( $post_id, '_team_designation', true );
	$linkedin        = get_post_meta( $post_id, '_team_linkedin',    true );
	$image_id        = get_post_thumbnail_id( $post_id );
	$image_url       = get_the_post_thumbnail_url( $post_id, 'medium' );
	$image_url_large = get_the_post_thumbnail_url( $post_id, 'large' );
	$image_alt       = $image_id ? get_post_meta( $image_id, '_wp_attachment_image_alt', true ) : '';
	if ( '' === $image_alt ) {
		$image_alt = $name;
	}
	$bio_html = (string) apply_filters( 'the_content', get_the_content() );

	$members_data[] = [
		'id'          => $post_id,
		'name'        => $name,
		'designation' => (string) $designation,
		'linkedin'    => (string) $linkedin,
		'imageUrl'    => (string) ( $image_url_large ?: '' ),
		'imageAlt'    => (string) $image_alt,
		'content'     => $bio_html,
	];

	ob_start();
	?>
	<article
		class="insignia-team-card insignia-team-card--<?php echo esc_attr( $card_style ); ?>"
		data-member-id="<?php echo esc_attr( $post_id ); ?>"
		role="button"
		tabindex="0"
		aria-label="<?php echo esc_attr( sprintf( __( 'View details for %s', 'insignia' ), $name ) ); ?>"
	>
		<div class="insignia-team-card__image-wrap">

			<?php if ( has_post_thumbnail() ) : ?>
			<img
				src="<?php echo esc_url( $image_url ); ?>"
				alt="<?php echo esc_attr( $image_alt ); ?>"
				class="insignia-team-card__image"
				loading="lazy"
			>
			<?php endif; ?>

			<?php if ( 'style1' === $card_style ) : ?>
			<div class="insignia-team-card__info-overlay">
				<div class="insignia-team-card__info-text">
					<div class="insignia-team-card__info-left">
						<h3 class="insignia-team-card__name">
							<?php echo esc_html( $name ); ?>
						</h3>
						<?php if ( $designation ) : ?>
						<p class="insignia-team-card__designation">
							<?php echo esc_html( $designation ); ?>
						</p>
						<?php endif; ?>
					</div>
					<?php if ( $linkedin ) : ?>
					<a
						class="insignia-team-card__linkedin-link"
						href="<?php echo esc_url( $linkedin ); ?>"
						aria-label="<?php echo esc_attr( sprintf( __( 'LinkedIn profile of %s', 'insignia' ), $name ) ); ?>"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
						</svg>
					</a>
					<?php endif; ?>
				</div>
			</div>
			<?php endif; ?>

		</div>

		<?php if ( 'style2' === $card_style ) : ?>
		<div class="insignia-team-card__body">
			<h3 class="insignia-team-card__name">
				<?php echo esc_html( $name ); ?>
			</h3>
			<?php if ( $designation ) : ?>
			<p class="insignia-team-card__designation">
				<?php echo esc_html( $designation ); ?>
			</p>
			<?php endif; ?>
			<?php if ( $linkedin ) : ?>
			<a
				class="insignia-team-card__linkedin-link"
				href="<?php echo esc_url( $linkedin ); ?>"
				aria-label="<?php echo esc_attr( sprintf( __( 'LinkedIn profile of %s', 'insignia' ), $name ) ); ?>"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
					<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
				</svg>
			</a>
			<?php endif; ?>
		</div>
		<?php endif; ?>

	</article>
	<?php
	$cards_html[] = ob_get_clean();
}
wp_reset_postdata();

// ── Encode data for view.js and generate unique popup IDs ─────────────────────
$members_json = wp_json_encode( $members_data );
$popup_id     = 'insignia-team-popup-' . wp_unique_id();
$title_id     = $popup_id . '-title';
?>

<div <?php echo $wrapper_attributes; ?> data-members="<?php echo esc_attr( $members_json ); ?>">

	<div class="insignia-team-grid__grid">
		<?php echo implode( '', $cards_html ); ?>
	</div>

	<div
		class="insignia-team-popup"
		id="<?php echo esc_attr( $popup_id ); ?>"
		role="dialog"
		aria-modal="true"
		aria-hidden="true"
		aria-labelledby="<?php echo esc_attr( $title_id ); ?>"
	>
		<div class="insignia-team-popup__backdrop" data-popup-close></div>
		<div class="insignia-team-popup__dialog" role="document">
			<button
				type="button"
				class="insignia-team-popup__close"
				data-popup-close
				aria-label="<?php esc_attr_e( 'Close', 'insignia' ); ?>"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>

			<div class="insignia-team-popup__image-wrap">
				<img class="insignia-team-popup__image" src="" alt="" hidden>
			</div>

			<div class="insignia-team-popup__content">
				<h2 class="insignia-team-popup__name" id="<?php echo esc_attr( $title_id ); ?>"></h2>
				<p class="insignia-team-popup__designation" hidden></p>
				<a
					class="insignia-team-popup__linkedin-link"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="<?php esc_attr_e( 'LinkedIn profile', 'insignia' ); ?>"
					hidden
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
					</svg>
				</a>
				<div class="insignia-team-popup__bio"></div>
			</div>
		</div>
	</div>

</div>

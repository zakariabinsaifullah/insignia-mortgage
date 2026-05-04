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
	'no_found_rows'  => true, // skips pagination count for performance
];

if ( ! empty( $post_in ) ) {
	// Show only the selected members in the user-specified ID order.
	$query_args['post__in'] = $post_in;
	$query_args['orderby']  = 'post__in';
} else {
	// Show all members using the chosen sort order.
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
?>

<div <?php echo $wrapper_attributes; ?>>

	<div class="insignia-team-grid__grid">

		<?php while ( $members_query->have_posts() ) : $members_query->the_post(); ?>
		<?php
			$post_id     = get_the_ID();
			$name        = get_the_title();
			$designation = get_post_meta( $post_id, '_team_designation', true );
			$linkedin    = get_post_meta( $post_id, '_team_linkedin',    true );
			$bio         = apply_filters( 'the_content', get_the_content() );
			$image_url   = get_the_post_thumbnail_url( $post_id, 'medium' );
			$image_alt   = get_post_meta( get_post_thumbnail_id( $post_id ), '_wp_attachment_image_alt', true ) ?: $name;

			// All member data is stored as JSON on the card element.
			// view.js reads this to populate the popup without a round-trip request.
			$member_data = wp_json_encode( [
				'name'        => $name,
				'designation' => $designation,
				'linkedin'    => $linkedin,
				'bio'         => $bio,
				'imageUrl'    => $image_url,
				'imageAlt'    => $image_alt,
			] );
		?>

		<article
			class="insignia-team-card"
			data-member="<?php echo esc_attr( $member_data ); ?>"
			tabindex="0"
			role="button"
			aria-label="<?php echo esc_attr( sprintf( __( 'View %s profile', 'insignia' ), $name ) ); ?>"
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

				<div class="insignia-team-card__overlay" aria-hidden="true">
					<svg class="insignia-team-card__overlay-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
					</svg>
				</div>

			</div>

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
				<div class="insignia-team-card__contact">
					<a
						class="insignia-team-card__contact-link"
						href="<?php echo esc_url( $linkedin ); ?>"
						aria-label="<?php echo esc_attr( sprintf( __( 'LinkedIn profile of %s', 'insignia' ), $name ) ); ?>"
						onclick="event.stopPropagation();"
						target="_blank"
						rel="noopener noreferrer"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
						</svg>
					</a>
				</div>
				<?php endif; ?>

			</div>
		</article>

		<?php endwhile; wp_reset_postdata(); ?>

	</div>

	<?php /* ── Popup shell — populated by view.js on card click ─────────── */ ?>
	<div
		class="insignia-team-grid__popup"
		role="dialog"
		aria-modal="true"
		aria-hidden="true"
		aria-label="<?php esc_attr_e( 'Team member profile', 'insignia' ); ?>"
	>
		<div class="insignia-team-grid__popup-overlay" aria-hidden="true"></div>

		<div class="insignia-team-grid__popup-dialog">

			<button
				class="insignia-team-grid__popup-close"
				aria-label="<?php esc_attr_e( 'Close', 'insignia' ); ?>"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
					<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
				</svg>
			</button>

			<div class="insignia-team-grid__popup-content">
				<?php /* JS populates this */ ?>
			</div>

		</div>
	</div>

</div>

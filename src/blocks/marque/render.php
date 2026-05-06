<?php
/**
 * Server-side rendering for the marquee block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

$gllb_speed = isset($attributes['speed']) ? max(1, intval($attributes['speed'])) : 30;
$gllb_pause_on_hover = !empty($attributes['pauseOnHover']);
$gllb_gap = isset($attributes['gap']) ? max(0, intval($attributes['gap'])) : 0;

// Use $content which already contains the fully rendered InnerBlocks HTML.
$gllb_inner_blocks_content = isset( $content ) ? $content : '';

// Build wrapper classes and styles
$gllb_wrapper_class = 'marquee-wrapper marquee-horizontal';
$gllb_wrapper_style = '';

// Build container classes.
$gllb_container_classes = array('marquee-container', 'marquee-horizontal');
if ($gllb_pause_on_hover) {
	$gllb_container_classes[] = 'pause-on-hover';
}
$gllb_container_class = implode(' ', $gllb_container_classes);

// Animation name is always left
$gllb_animation_name = 'marquee-scroll-left';

// Build container styles.
$gllb_container_styles = array(
	'--animation-duration: ' . $gllb_speed . 's',
	'--animation-name: ' . $gllb_animation_name,
	'--marquee-gap: ' . $gllb_gap . 'px',
);
$gllb_container_style = ' style="' . implode('; ', $gllb_container_styles) . ';"';

// Marquee content styles with padding at the end so it includes the gap for translation.
$gllb_content_style = ' style="gap: ' . esc_attr($gllb_gap) . 'px; padding-right: ' . esc_attr($gllb_gap) . 'px;"';

?>
<div <?php echo get_block_wrapper_attributes(array('class' => $gllb_wrapper_class)); ?> <?php echo $gllb_wrapper_style; ?>>
	<div class="<?php echo esc_attr($gllb_container_class); ?>" <?php echo $gllb_container_style; ?>>
		<?php for ( $i = 0; $i < 6; $i++ ) : ?>
			<div class="marquee-content" <?php echo $i > 0 ? 'aria-hidden="true"' : ''; ?> <?php echo $gllb_content_style; ?>>
				<?php echo $gllb_inner_blocks_content; ?>
			</div>
		<?php endfor; ?>
	</div>
</div>
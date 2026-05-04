/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { getBlockSupport, getBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import HoverColorsControls from './controls/colors-controls';
import HoverTransitionControls from './controls/transition-controls';

import './style.scss';

/**
 * Check if a block supports text color.
 *
 * @param {object} blockTypeOrSettings Block type or settings object.
 * @returns {boolean}
 */
const hasTextColorSupport = blockTypeOrSettings => {
    const colorSupport = getBlockSupport(blockTypeOrSettings, 'color');
    return colorSupport && colorSupport.text !== false;
};

/**
 * Add hover color attributes to all blocks that support text color.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#blocks-registerblocktype
 */
addFilter('blocks.registerBlockType', 'gutenlayouts/hover-color-add-attributes', settings => {
    if (!hasTextColorSupport(settings)) {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            hoverTextColor: {
                type: 'string'
            },
            customHoverTextColor: {
                type: 'string'
            },
            hoverBackgroundColor: {
                type: 'string'
            },
            customHoverBackgroundColor: {
                type: 'string'
            },
            hoverBackgroundGradient: {
                type: 'string'
            },
            hoverBorderColor: {
                type: 'string'
            },
            customHoverBorderColor: {
                type: 'string'
            },
            hoverTransitionDuration: {
                type: 'number',
                default: 200
            },
            hoverTransitionTiming: {
                type: 'string',
                default: 'ease'
            }
        }
    };
});

/**
 * Add hover color controls to the block inspector sidebar.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#editor-blockedit
 */
addFilter(
    'editor.BlockEdit',
    'gutenlayouts/hover-color-add-inspector-controls',
    createHigherOrderComponent(BlockEdit => {
        return props => {
            const { name, attributes, setAttributes, clientId } = props;

            if (!hasTextColorSupport(getBlockType(name))) {
                return <BlockEdit {...props} />;
            }

            return (
                <>
                    <BlockEdit {...props} />
                    <InspectorControls group="color">
                        {props.children}
                        <HoverColorsControls attributes={attributes} setAttributes={setAttributes} clientId={clientId} />
                        <HoverTransitionControls attributes={attributes} setAttributes={setAttributes} clientId={clientId} />
                    </InspectorControls>
                </>
            );
        };
    })
);

/**
 * Apply hover color classes and CSS custom properties in the editor preview.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#editor-blocklistblock
 */
addFilter(
    'editor.BlockListBlock',
    'gutenlayouts/hover-color-add-styles',
    createHigherOrderComponent(BlockListBlock => {
        return props => {
            const { name, attributes } = props;

            if (!hasTextColorSupport(getBlockType(name))) {
                return <BlockListBlock {...props} />;
            }

            const {
                hoverTextColor,
                customHoverTextColor,
                hoverBackgroundColor,
                customHoverBackgroundColor,
                hoverBackgroundGradient,
                hoverBorderColor,
                customHoverBorderColor,
                hoverTransitionDuration,
                hoverTransitionTiming
            } = attributes;

            const hasHoverText = hoverTextColor || customHoverTextColor;
            const hasHoverBgColor = hoverBackgroundColor || customHoverBackgroundColor;
            const hasHoverBgGradient = !!hoverBackgroundGradient;
            const hasHoverBorder = hoverBorderColor || customHoverBorderColor;

            if (!hasHoverText && !hasHoverBgColor && !hasHoverBgGradient && !hasHoverBorder) {
                return <BlockListBlock {...props} />;
            }

            const getColorValue = (presetColor, customColor) =>
                presetColor ? `var(--wp--preset--color--${presetColor})` : customColor || '';

            const wrapperProps = {
                ...props.wrapperProps,
                style: {
                    ...props.wrapperProps?.style,
                    '--hover-color': getColorValue(hoverTextColor, customHoverTextColor),
                    '--hover-background-color': getColorValue(hoverBackgroundColor, customHoverBackgroundColor),
                    '--hover-background-gradient': hoverBackgroundGradient || '',
                    '--hover-border-color': getColorValue(hoverBorderColor, customHoverBorderColor),
                    '--hover-transition-duration': hoverTransitionDuration + 'ms',
                    '--hover-transition-timing': hoverTransitionTiming
                }
            };

            const classes = [
                props.className,
                hasHoverText ? 'has-hover__color' : '',
                hasHoverBgColor ? 'has-hover__background-color' : '',
                hasHoverBgGradient ? 'has-hover__background-gradient' : '',
                hasHoverBorder ? 'has-hover__border-color' : ''
            ]
                .filter(Boolean)
                .join(' ');

            return <BlockListBlock {...props} className={classes} wrapperProps={wrapperProps} />;
        };
    })
);

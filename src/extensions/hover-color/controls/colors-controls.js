/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    withColors,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients
} from '@wordpress/block-editor';

const HoverColorsControls = ({
    clientId,
    attributes,
    setAttributes,
    hoverTextColor,
    hoverBackgroundColor,
    hoverBorderColor,
    setHoverTextColor,
    setHoverBackgroundColor,
    setHoverBorderColor
}) => {
    const { hoverBackgroundGradient } = attributes;

    const colorSettings = [
        {
            value: hoverTextColor?.color,
            onChange: setHoverTextColor,
            isShownByDefault: false,
            label: __('Hover Text', 'gl-layout-builder'),
            resetAllFilter: () => ({
                hoverTextColor: undefined,
                customHoverTextColor: undefined
            })
        },
        {
            value: hoverBackgroundColor?.color,
            onChange: color => {
                setHoverBackgroundColor(color);
                // Clear gradient when a solid color is chosen.
                if (color) {
                    setAttributes({ hoverBackgroundGradient: undefined });
                }
            },
            gradientValue: hoverBackgroundGradient || undefined,
            onGradientChange: gradient => {
                // Clear solid background color when a gradient is chosen.
                setAttributes({
                    hoverBackgroundGradient: gradient || undefined,
                    hoverBackgroundColor: undefined,
                    customHoverBackgroundColor: undefined
                });
            },
            isShownByDefault: false,
            label: __('Hover Background', 'gl-layout-builder'),
            resetAllFilter: () => ({
                hoverBackgroundColor: undefined,
                customHoverBackgroundColor: undefined,
                hoverBackgroundGradient: undefined
            })
        },
        {
            value: hoverBorderColor?.color,
            onChange: setHoverBorderColor,
            isShownByDefault: false,
            label: __('Hover Border', 'gl-layout-builder'),
            resetAllFilter: () => ({
                hoverBorderColor: undefined,
                customHoverBorderColor: undefined
            })
        }
    ];

    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    if (!colorGradientSettings.hasColorsOrGradients) {
        return null;
    }

    return (
        <>
            {colorSettings.map(({ onChange, onGradientChange, label, isShownByDefault, value, gradientValue, resetAllFilter }) => {
                const setting = {
                    colorValue: value,
                    onColorChange: onChange,
                    label,
                    resetAllFilter,
                    isShownByDefault,
                    enableAlpha: true,
                    clearable: true
                };

                // Only add gradient props when the setting explicitly supports it,
                // otherwise the GradientPicker mounts with no value and crashes on
                // trying to read `.orientation` from a parsed undefined gradient.
                if ( onGradientChange !== undefined ) {
                    setting.gradientValue    = gradientValue;
                    setting.onGradientChange = onGradientChange;
                }

                return (
                    <ColorGradientSettingsDropdown
                        key={`hover-color-${label}`}
                        __experimentalIsRenderedInSidebar
                        settings={[ setting ]}
                        panelId={clientId}
                        {...colorGradientSettings}
                    />
                );
            })}
        </>
    );
};

export default withColors(
    { hoverTextColor: 'color' },
    { hoverBackgroundColor: 'background-color' },
    { hoverBorderColor: 'border-color' }
)(HoverColorsControls);

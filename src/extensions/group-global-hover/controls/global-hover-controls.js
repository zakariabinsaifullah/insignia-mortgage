/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    withColors,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients
} from '@wordpress/block-editor';

const GlobalHoverControls = ( {
    clientId,
    attributes,
    setAttributes,
    globalHoverBgColor,
    setGlobalHoverBgColor,
    globalHoverColor,
    setGlobalHoverColor
} ) => {
    const { globalHoverBgGradient } = attributes;

    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    if ( ! colorGradientSettings.hasColorsOrGradients ) {
        return null;
    }

    const colorSettings = [
        {
            // Background — solid + gradient
            value: globalHoverBgColor?.color,
            onChange: ( color ) => {
                setGlobalHoverBgColor( color );
                if ( color ) {
                    setAttributes( { globalHoverBgGradient: undefined } );
                }
            },
            gradientValue: globalHoverBgGradient || undefined,
            onGradientChange: ( gradient ) => {
                setAttributes( {
                    globalHoverBgGradient: gradient || undefined,
                    globalHoverBgColor: undefined,
                    customGlobalHoverBgColor: undefined
                } );
            },
            label: __( 'Hover Background', 'gl-layout-builder' ),
            isShownByDefault: true,
            enableAlpha: true,
            clearable: true,
            resetAllFilter: () => ( {
                globalHoverBgColor: undefined,
                customGlobalHoverBgColor: undefined,
                globalHoverBgGradient: undefined
            } )
        },
        {
            // Color — solid only
            value: globalHoverColor?.color,
            onChange: setGlobalHoverColor,
            label: __( 'Hover Color', 'gl-layout-builder' ),
            isShownByDefault: true,
            enableAlpha: true,
            clearable: true,
            resetAllFilter: () => ( {
                globalHoverColor: undefined,
                customGlobalHoverColor: undefined
            } )
        }
    ];

    return (
        <>
            { colorSettings.map( ( { onChange, onGradientChange, label, isShownByDefault, value, gradientValue, resetAllFilter, enableAlpha, clearable } ) => {
                const setting = {
                    colorValue: value,
                    onColorChange: onChange,
                    label,
                    resetAllFilter,
                    isShownByDefault,
                    enableAlpha,
                    clearable
                };

                // Only attach gradient props to the background setting.
                if ( onGradientChange !== undefined ) {
                    setting.gradientValue    = gradientValue;
                    setting.onGradientChange = onGradientChange;
                }

                return (
                    <ColorGradientSettingsDropdown
                        key={ `global-hover-${ label }` }
                        __experimentalIsRenderedInSidebar
                        settings={ [ setting ] }
                        panelId={ clientId }
                        { ...colorGradientSettings }
                    />
                );
            } ) }
        </>
    );
};

export default withColors(
    { globalHoverBgColor: 'background-color' },
    { globalHoverColor: 'color' }
)( GlobalHoverControls );

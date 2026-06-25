/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { TextareaControl, Button, Flex, RangeControl, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { getIconByName, icons, getIconType } from '../../../utils/icons';

/**
 * ContentCustom Component
 * Displays custom SVG editor with preview and controls
 * @param root0
 * @param root0.tempCustomSvgCode
 * @param root0.setTempCustomSvgCode
 * @param root0.previewIconSize
 * @param root0.setPreviewIconSize
 * @param root0.previewStrokeWidth
 * @param root0.setPreviewStrokeWidth
 * @param root0.currentCustomSvg
 * @param root0.currentIconName
 * @param root0.insertCustomSVG
 * @param root0.clearCustomSVG
 */
export const ContentCustom = ( {
    tempCustomSvgCode,
    setTempCustomSvgCode,
    previewIconSize,
    setPreviewIconSize,
    previewStrokeWidth,
    setPreviewStrokeWidth,
    currentCustomSvg,
    currentIconName,
    insertCustomSVG,
    clearCustomSVG
} ) => {
    const tempIconType = getIconType( tempCustomSvgCode );

    // Function to render the current icon preview
    const renderCurrentIcon = ( size, customCode, customStroke ) => {
        const svgCode = customCode !== null ? customCode : currentCustomSvg;
        const currentType = getIconType( svgCode );

        if ( svgCode ) {
            let finalSvgCode = svgCode;

            if ( currentType === 'line' && customStroke !== null ) {
                finalSvgCode = svgCode.replace( /stroke-width="([^"]*)"/g, `stroke-width="${ customStroke }"` );
            }

            return (
                <div
                    className="insignia-custom-svg-container"
                    dangerouslySetInnerHTML={ { __html: finalSvgCode } }
                    style={ { width: `${ size }px`, height: `${ size }px` } }
                />
            );
        }

        const selectedIcon = getIconByName( currentIconName );
        if ( selectedIcon ) {
            return <Icon icon={ selectedIcon.icon } size={ size } />;
        }

        return <Icon icon={ icons[ 0 ].icon } size={ size } />;
    };

    return (
        <div className="insignia-modal__custom-svg">
            <div className="insignia-modal__custom-svg-editor">
                <TextareaControl
                    label={ __( 'Custom SVG code', 'insignia' ) }
                    value={ tempCustomSvgCode }
                    onChange={ setTempCustomSvgCode }
                    help={ __( 'Paste your custom SVG code here. It will override the selected icon.', 'insignia' ) }
                    rows={ 15 }
                />
            </div>

            <div className="insignia-modal__custom-svg-preview">
                <h3>{ __( 'Preview', 'insignia' ) }</h3>
                <div className="insignia-icon-preview-container">
                    { tempCustomSvgCode ? (
                        renderCurrentIcon( previewIconSize, tempCustomSvgCode, previewStrokeWidth )
                    ) : (
                        <div className="insignia-empty-preview">{ __( 'Enter SVG code to see preview', 'insignia' ) }</div>
                    ) }
                </div>

                <div className="insignia-modal__custom-svg-controls">
                    <RangeControl
                        label={ __( 'Icon Size', 'insignia' ) }
                        value={ previewIconSize }
                        onChange={ setPreviewIconSize }
                        min={ 16 }
                        max={ 256 }
                        __next40pxDefaultSize
                    />

                    { tempIconType === 'line' && (
                        <RangeControl
                            label={ __( 'Stroke Width', 'insignia' ) }
                            value={ previewStrokeWidth }
                            onChange={ setPreviewStrokeWidth }
                            min={ 0.5 }
                            max={ 5 }
                            step={ 0.1 }
                            __next40pxDefaultSize
                        />
                    ) }
                </div>
                <div className="insignia-modal__custom-svg-buttons">
                    <Flex>
                        <Button
                            __next40pxDefaultSize
                            variant="secondary"
                            onClick={ clearCustomSVG }
                            isDestructive
                            style={ { flex: '1', justifyContent: 'center' } }
                        >
                            { __( 'Clear', 'insignia' ) }
                        </Button>
                        <Button
                            __next40pxDefaultSize
                            variant="primary"
                            onClick={ insertCustomSVG }
                            disabled={ ! tempCustomSvgCode }
                            style={ { flex: '1', justifyContent: 'center' } }
                        >
                            { __( 'Insert Custom Icon', 'insignia' ) }
                        </Button>
                    </Flex>
                </div>
            </div>
        </div>
    );
};

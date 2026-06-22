import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { PanelColorControl, NativeRangeControl } from '../../components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const { badgeColor, badgeBgColor, borderColor, badgeFontSize, footerColor, footerFontSize } = attributes;

    return (
        <InspectorControls group="styles">
            <PanelBody title={__('Frame', 'insignia')} initialOpen={true}>
                <PanelColorControl
                    label={__('Frame Border', 'insignia')}
                    colorSettings={[
                        {
                            value: borderColor,
                            onChange: color => setAttributes({ borderColor: color }),
                            label: __('Border Color', 'insignia')
                        }
                    ]}
                />
            </PanelBody>
            <PanelBody title={__('Badge', 'insignia')} initialOpen={false}>
                <NativeRangeControl
                    label={__('Font Size', 'insignia')}
                    value={badgeFontSize}
                    onChange={value => setAttributes({ badgeFontSize: value })}
                    min={10}
                    max={40}
                    step={1}
                    resetFallbackValue={14}
                />
                <PanelColorControl
                    label={__('Badge Colors', 'insignia')}
                    colorSettings={[
                        {
                            value: badgeColor,
                            onChange: color => setAttributes({ badgeColor: color }),
                            label: __('Text Color', 'insignia')
                        },
                        {
                            value: badgeBgColor,
                            onChange: color => setAttributes({ badgeBgColor: color }),
                            label: __('Background', 'insignia')
                        }
                    ]}
                />
            </PanelBody>
            <PanelBody title={__('Footer', 'insignia')} initialOpen={false}>
                <NativeRangeControl
                    label={__('Font Size', 'insignia')}
                    value={footerFontSize}
                    onChange={value => setAttributes({ footerFontSize: value })}
                    min={10}
                    max={40}
                    step={1}
                    resetFallbackValue={13}
                />
                <PanelColorControl
                    label={__('Footer Colors', 'insignia')}
                    colorSettings={[
                        {
                            value: footerColor,
                            onChange: color => setAttributes({ footerColor: color }),
                            label: __('Text Color', 'insignia')
                        }
                    ]}
                />
            </PanelBody>
        </InspectorControls>
    );
};

export default Inspector;

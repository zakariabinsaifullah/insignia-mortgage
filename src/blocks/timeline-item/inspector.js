import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { PanelColorControl, NativeIconPicker } from '../../components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const { iconName, customSvgCode, iconBgColor } = attributes;

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Icon', 'insignia')} initialOpen={false}>
                    <NativeIconPicker
                        label={__('Select Icon', 'insignia')}
                        onIconSelect={(name, iconType) => {
                            setAttributes({ iconName: name, customSvgCode: '' });
                        }}
                        onCustomSvgInsert={({ customSvgCode: svg }) => {
                            setAttributes({ customSvgCode: svg, iconName: '' });
                        }}
                        iconName={iconName}
                        customSvgCode={customSvgCode}
                    />
                </PanelBody>
            </InspectorControls>
            <InspectorControls group="styles">
                <PanelBody title={__('Icon Circle', 'insignia')} initialOpen={true}>
                    <PanelColorControl
                        label={__('Circle Background', 'insignia')}
                        colorSettings={[
                            {
                                value: iconBgColor,
                                onChange: color => setAttributes({ iconBgColor: color }),
                                label: __('Background', 'insignia')
                            }
                        ]}
                    />
                </PanelBody>
            </InspectorControls>
        </>
    );
};

export default Inspector;

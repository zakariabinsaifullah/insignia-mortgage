import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import {
    NativeRangeControl,
    PanelColorControl
} from '../../components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const { height, gap, borderRadius, activeWidth, inactiveWidth, overlayColor } = attributes;

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Accordion Settings', 'insignia')} initialOpen={true}>
                    <NativeRangeControl
                        label={__('Height (px)', 'insignia')}
                        value={height}
                        onChange={value => setAttributes({ height: value })}
                        min={200}
                        max={900}
                        step={10}
                        resetFallbackValue={500}
                    />
                    <NativeRangeControl
                        label={__('Gap (px)', 'insignia')}
                        value={gap}
                        onChange={value => setAttributes({ gap: value })}
                        min={0}
                        max={30}
                        step={1}
                        resetFallbackValue={5}
                    />
                    <NativeRangeControl
                        label={__('Border Radius (px)', 'insignia')}
                        value={borderRadius}
                        onChange={value => setAttributes({ borderRadius: value })}
                        min={0}
                        max={50}
                        step={1}
                        resetFallbackValue={15}
                    />
                    <NativeRangeControl
                        label={__('Active Item Width (%)', 'insignia')}
                        value={activeWidth}
                        onChange={value => setAttributes({ activeWidth: value })}
                        min={30}
                        max={80}
                        step={1}
                        resetFallbackValue={50}
                    />
                    <NativeRangeControl
                        label={__('Inactive Item Width (%)', 'insignia')}
                        value={inactiveWidth}
                        onChange={value => setAttributes({ inactiveWidth: value })}
                        min={1}
                        max={30}
                        step={1}
                        resetFallbackValue={10}
                    />
                </PanelBody>
            </InspectorControls>
            <InspectorControls group="styles">
                <PanelBody title={__('Overlay Color', 'insignia')} initialOpen={true}>
                    <PanelColorControl
                        label={__('Inactive Overlay Color', 'insignia')}
                        colorSettings={[
                            {
                                value: overlayColor,
                                onChange: color => setAttributes({ overlayColor: color }),
                                label: __('Color', 'insignia')
                            }
                        ]}
                    />
                </PanelBody>
            </InspectorControls>
        </>
    );
};

export default Inspector;

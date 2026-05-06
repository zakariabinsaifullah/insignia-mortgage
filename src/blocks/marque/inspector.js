import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import { NativeRangeControl, NativeToggleControl } from '../../components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const { speed, pauseOnHover, gap } = attributes;

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Marquee Settings', 'gl-layout-builder')}>
                    <NativeRangeControl
                        label={__('Speed', 'gl-layout-builder')}
                        value={speed}
                        onChange={value => setAttributes({ speed: value })}
                        min={1}
                        max={200}
                        step={1}
                        help={__('Higher values = Slower scrolling', 'gl-layout-builder')}
                    />
                    <NativeRangeControl
                        label={__('Gap between items (px)', 'gl-layout-builder')}
                        value={gap}
                        onChange={value => setAttributes({ gap: value })}
                        min={0}
                        max={100}
                        step={1}
                    />
                    <NativeToggleControl
                        label={__('Pause on Hover', 'gl-layout-builder')}
                        checked={pauseOnHover}
                        onChange={value => setAttributes({ pauseOnHover: value })}
                    />
                </PanelBody>
            </InspectorControls>
        </>
    );
};

export default Inspector;

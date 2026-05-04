import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    __experimentalToolsPanel as ToolsPanel, // eslint-disable-line
    __experimentalToolsPanelItem as ToolsPanelItem // eslint-disable-line
} from '@wordpress/components';

import {
    NativeToggleGroupControl,
    NativeRangeControl,
    NativeToggleControl,
    PanelColorControl,
    NativeSelectControl
} from '../../components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const { enableRating, totalRating, rating, nrPos, ratingSize, ratingNsize, ratingColor, nuRatColor, alignment } = attributes;

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Settings', 'gl-layout-builder')} initialOpen={true}>
                    <NativeToggleControl
                        label={__('Show Numeric Rating', 'gl-layout-builder')}
                        checked={enableRating}
                        onChange={value => setAttributes({ enableRating: value })}
                    />
                    {enableRating && (
                        <NativeSelectControl
                            label={__('Position', 'gl-layout-builder')}
                            value={nrPos}
                            options={[
                                { label: __('Left', 'gl-layout-builder'), value: 'nr_left' },
                                { label: __('Right', 'gl-layout-builder'), value: 'nr_right' },
                                { label: __('Top', 'gl-layout-builder'), value: 'nr_top' },
                                { label: __('Bottom', 'gl-layout-builder'), value: 'nr_bottom' }
                            ]}
                            onChange={value => setAttributes({ nrPos: value })}
                        />
                    )}
                    <NativeToggleGroupControl
                        label={__('Alignment', 'gl-layout-builder')}
                        value={alignment}
                        onChange={value => setAttributes({ alignment: value })}
                        options={[
                            { value: '', label: __('Left', 'gl-layout-builder') },
                            { value: 'center', label: __('Center', 'gl-layout-builder') },
                            { value: 'right', label: __('Right', 'gl-layout-builder') }
                        ]}
                    />
                </PanelBody>
                <PanelBody title={__('Rating', 'gl-layout-builder')} initialOpen={false}>
                    <NativeRangeControl
                        label={__('Total Rating', 'gl-layout-builder')}
                        value={totalRating}
                        onChange={value => setAttributes({ totalRating: value })}
                        min={1}
                        max={10}
                        step={1}
                        resetFallbackValue={5}
                    />
                    <NativeRangeControl
                        label={__('Rating Value', 'gl-layout-builder')}
                        value={rating}
                        onChange={value => setAttributes({ rating: value })}
                        min={0}
                        max={totalRating}
                        step={0.1}
                        resetFallbackValue={4.5}
                    />
                </PanelBody>
            </InspectorControls>
            <InspectorControls group="styles">
                <ToolsPanel
                    label={__('Rating', 'gl-layout-builder')}
                    resetAll={() =>
                        setAttributes({
                            ratingSize: undefined,
                            ratingColor: undefined
                        })
                    }
                >
                    <ToolsPanelItem
                        hasValue={() => !!ratingSize}
                        label={__('Size', 'gl-layout-builder')}
                        onDeselect={() => {
                            setAttributes({
                                ratingSize: undefined
                            });
                        }}
                        onSelect={() => {}}
                    >
                        <NativeRangeControl
                            label={__('Rating Size', 'gl-layout-builder')}
                            value={ratingSize}
                            onChange={value => setAttributes({ ratingSize: value })}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </ToolsPanelItem>

                    <ToolsPanelItem
                        hasValue={() => !!ratingColor}
                        label={__('Color', 'gl-layout-builder')}
                        onDeselect={() => {
                            setAttributes({
                                ratingColor: undefined
                            });
                        }}
                        onSelect={() => {}}
                    >
                        <PanelColorControl
                            label={__('Star Color', 'gl-layout-builder')}
                            colorSettings={[
                                {
                                    value: ratingColor,
                                    onChange: color => setAttributes({ ratingColor: color })
                                }
                            ]}
                        />
                    </ToolsPanelItem>
                </ToolsPanel>
                {enableRating && (
                    <ToolsPanel
                        label={__('Numeric Rating', 'gl-layout-builder')}
                        resetAll={() =>
                            setAttributes({
                                ratingNsize: undefined,
                                nuRatColor: undefined
                            })
                        }
                    >
                        <ToolsPanelItem
                            hasValue={() => !!ratingNsize}
                            label={__('Size', 'gl-layout-builder')}
                            onDeselect={() => {
                                setAttributes({
                                    ratingNsize: undefined
                                });
                            }}
                            onSelect={() => {}}
                        >
                            <NativeRangeControl
                                label={__('Font Size', 'gl-layout-builder')}
                                value={ratingNsize}
                                onChange={value => setAttributes({ ratingNsize: value })}
                                min={0}
                                max={100}
                                step={1}
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            hasValue={() => !!nuRatColor}
                            label={__('Color', 'gl-layout-builder')}
                            onDeselect={() => {
                                setAttributes({
                                    nuRatColor: undefined
                                });
                            }}
                            onSelect={() => {}}
                        >
                            <PanelColorControl
                                label={__('Text Color', 'gl-layout-builder')}
                                colorSettings={[
                                    {
                                        value: nuRatColor,
                                        onChange: color => setAttributes({ nuRatColor: color }),
                                        label: __('Color', 'gl-layout-builder')
                                    }
                                ]}
                            />
                        </ToolsPanelItem>
                    </ToolsPanel>
                )}
            </InspectorControls>
        </>
    );
};

export default Inspector;

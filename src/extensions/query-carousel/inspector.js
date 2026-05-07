/**
 * Query Carousel — Inspector Controls
 *
 * Adds carousel-specific settings (columns, gap, autoplay, loop)
 * plus toggles for arrows and pagination.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import {
    NativeRangeControl,
    NativeToggleControl,
    NativeResponsiveControl
} from '../../components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const {
        qcTotalPosts,
        qcColumns,
        qcGaps,
        qcAutoplay,
        qcDelay,
        qcLoop,
        qcShowArrows,
        qcShowPagination,
        qcExcludeCurrentPost,
        resMode
    } = attributes;

    const currentResMode = resMode || 'Desktop';

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Carousel Settings', 'insignia')} initialOpen={true}>
                    <NativeRangeControl
                        label={__('Total Posts', 'insignia')}
                        value={qcTotalPosts || 6}
                        onChange={value => {
                            setAttributes({
                                qcTotalPosts: value,
                                query: { ...attributes.query, perPage: value }
                            });
                        }}
                        min={1}
                        max={50}
                        step={1}
                    />
                    <NativeToggleControl
                        label={__('Exclude Current Post', 'insignia')}
                        checked={qcExcludeCurrentPost}
                        onChange={value => setAttributes({ qcExcludeCurrentPost: value })}
                    />
                    <NativeResponsiveControl label={__('Columns', 'insignia')} props={props}>
                        <NativeRangeControl
                            value={qcColumns?.[currentResMode] ?? 3}
                            onChange={value => {
                                const newColumns = { ...(qcColumns || { Desktop: 3, Tablet: 2, Mobile: 1 }), [currentResMode]: value };
                                setAttributes({ qcColumns: newColumns });
                            }}
                            min={1}
                            max={6}
                            step={1}
                        />
                    </NativeResponsiveControl>
                    <NativeResponsiveControl label={__('Gap', 'insignia')} props={props}>
                        <NativeRangeControl
                            value={qcGaps?.[currentResMode] ?? 20}
                            onChange={value => {
                                const newGaps = { ...(qcGaps || { Desktop: 20, Tablet: 15, Mobile: 0 }), [currentResMode]: value };
                                setAttributes({ qcGaps: newGaps });
                            }}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </NativeResponsiveControl>
                    <NativeToggleControl
                        label={__('Loop', 'insignia')}
                        checked={qcLoop}
                        onChange={value => setAttributes({ qcLoop: value })}
                    />
                    <NativeToggleControl
                        label={__('Autoplay', 'insignia')}
                        checked={qcAutoplay}
                        onChange={value => setAttributes({ qcAutoplay: value })}
                    />
                    {qcAutoplay && (
                        <NativeRangeControl
                            label={__('Delay (ms)', 'insignia')}
                            value={qcDelay || 3000}
                            onChange={value => setAttributes({ qcDelay: value })}
                            min={1000}
                            max={10000}
                            step={500}
                        />
                    )}
                    <NativeToggleControl
                        label={__('Show Arrows', 'insignia')}
                        checked={qcShowArrows}
                        onChange={value => setAttributes({ qcShowArrows: value })}
                    />
                    <NativeToggleControl
                        label={__('Show Pagination', 'insignia')}
                        checked={qcShowPagination}
                        onChange={value => setAttributes({ qcShowPagination: value })}
                    />
                </PanelBody>
            </InspectorControls>
        </>
    );
};

export default Inspector;
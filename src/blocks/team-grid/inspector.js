/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
    NativeResponsiveControl,
    NativeUnitControl,
    NativeSelectControl,
    NativeTextareaControl,
    PanelColorControl
} from '../../components';

export default function Inspector(props) {
    const { attributes, setAttributes } = props;
    const {
        columns,
        resMode,
        gap,
        orderBy,
        selectedIds,
        cardBg,
        cardPadding,
        cardRadius,
        cardBorderColor,
        cardBorderWidth,
        nameColor,
        nameSize,
        designationColor,
        iconColor,
        overlayColor
    } = attributes;

    // Sync CSS custom properties into blockStyle whenever a style attribute changes.
    // render.php reads blockStyle to apply them as inline CSS on the wrapper.
    useEffect(() => {
        setAttributes({
            blockStyle: {
                ...(columns.Desktop !== 2 && { '--dcols': String(columns.Desktop) }),
                ...(columns.Tablet !== 2 && { '--tcols': String(columns.Tablet) }),
                ...(columns.Mobile !== 1 && { '--mcols': String(columns.Mobile) }),
                ...(gap && { '--gap': gap }),
                ...(cardBg && { '--card-bg': cardBg }),
                ...(cardPadding && { '--card-padding': cardPadding }),
                ...(cardRadius && { '--card-radius': cardRadius }),
                ...(cardBorderColor && { '--card-border-color': cardBorderColor }),
                ...(cardBorderWidth && { '--card-border-width': cardBorderWidth }),
                ...(nameColor && { '--name-color': nameColor }),
                ...(designationColor && { '--designation-color': designationColor }),
                ...(iconColor && { '--icon-color': iconColor }),
                ...(overlayColor && { '--overlay-color': overlayColor })
            }
        });
    }, [
        columns,
        gap,
        cardBg,
        cardPadding,
        cardRadius,
        cardBorderColor,
        cardBorderWidth,
        nameColor,
        nameSize,
        designationColor,
        iconColor,
        overlayColor
    ]);

    return (
        <>
            {/* ── Settings ─────────────────────────────────────────────── */}
            <InspectorControls>
                <PanelBody title={__('Grid', 'insignia')}>
                    <NativeResponsiveControl label={__('Columns', 'insignia')} props={props}>
                        <RangeControl
                            value={columns[resMode]}
                            onChange={value => setAttributes({ columns: { ...columns, [resMode]: value } })}
                            min={1}
                            max={6}
                            __next40pxDefaultSize
                        />
                    </NativeResponsiveControl>

                    <NativeUnitControl label={__('Gap', 'insignia')} value={gap} onChange={value => setAttributes({ gap: value })} mb={0} />
                </PanelBody>

                <PanelBody title={__('Query', 'insignia')} initialOpen={false}>
                    <NativeSelectControl
                        label={__('Order By', 'insignia')}
                        value={orderBy}
                        onChange={value => setAttributes({ orderBy: value })}
                        options={[
                            { label: __('Menu Order', 'insignia'), value: 'menu_order' },
                            { label: __('Date (newest)', 'insignia'), value: 'date' },
                            { label: __('Name (A – Z)', 'insignia'), value: 'title' },
                            { label: __('Random', 'insignia'), value: 'rand' }
                        ]}
                    />

                    <NativeTextareaControl
                        label={__('Show Specific Members', 'insignia')}
                        value={selectedIds}
                        onChange={value => setAttributes({ selectedIds: value })}
                        placeholder="5, 12, 34"
                        help={__(
                            'Enter post IDs separated by commas. Leave empty to show all members. The members IDs are visible in the Team list in the admin.',
                            'insignia'
                        )}
                    />
                </PanelBody>
            </InspectorControls>

            {/* ── Styles ──────────────────────────────────────────────── */}
            <InspectorControls group="styles">
                <ToolsPanel
                    label={__('Card', 'insignia')}
                    resetAll={() =>
                        setAttributes({
                            cardBg: undefined,
                            cardPadding: '20px',
                            cardRadius: '8px',
                            cardBorderColor: undefined,
                            cardBorderWidth: undefined
                        })
                    }
                >
                    <ToolsPanelItem
                        hasValue={() => !!cardBg || !!cardBorderColor}
                        label={__('Colors', 'insignia')}
                        onDeselect={() => setAttributes({ cardBg: undefined })}
                        onSelect={() => {}}
                    >
                        <PanelColorControl
                            label={__('Colors', 'insignia')}
                            colorSettings={[
                                {
                                    value: cardBorderColor,
                                    onChange: color => setAttributes({ cardBorderColor: color }),
                                    label: __('Color', 'insignia')
                                },
                                {
                                    value: cardBg,
                                    onChange: color => setAttributes({ cardBg: color }),
                                    label: __('Background', 'insignia')
                                }
                            ]}
                        />
                    </ToolsPanelItem>

                    <ToolsPanelItem
                        hasValue={() => !!cardBorderColor}
                        label={__('Border', 'insignia')}
                        onDeselect={() => setAttributes({ cardBorderColor: undefined, cardBorderWidth: undefined })}
                        onSelect={() => {}}
                    >
                        <NativeUnitControl
                            label={__('Border Width', 'insignia')}
                            value={cardBorderWidth}
                            onChange={value => setAttributes({ cardBorderWidth: value })}
                        />
                    </ToolsPanelItem>

                    <ToolsPanelItem
                        hasValue={() => cardRadius !== '8px'}
                        label={__('Radius', 'insignia')}
                        onDeselect={() => setAttributes({ cardRadius: '8px' })}
                        onSelect={() => {}}
                    >
                        <NativeUnitControl
                            label={__('Radius', 'insignia')}
                            value={cardRadius}
                            onChange={value => setAttributes({ cardRadius: value })}
                        />
                    </ToolsPanelItem>

                    <ToolsPanelItem
                        hasValue={() => cardPadding !== '20px'}
                        label={__('Padding', 'insignia')}
                        onDeselect={() => setAttributes({ cardPadding: '20px' })}
                        onSelect={() => {}}
                    >
                        <NativeUnitControl
                            label={__('Padding', 'insignia')}
                            value={cardPadding}
                            onChange={value => setAttributes({ cardPadding: value })}
                        />
                    </ToolsPanelItem>
                </ToolsPanel>

                <ToolsPanel
                    label={__('Bio', 'insignia')}
                    resetAll={() =>
                        setAttributes({
                            nameColor: undefined,
                            designationColor: undefined,
                            iconColor: undefined,
                            overlayColor: undefined
                        })
                    }
                >
                    <ToolsPanelItem
                        hasValue={() => !!nameColor || !!designationColor || !!iconColor || !!overlayColor}
                        label={__('Colors', 'insignia')}
                        onDeselect={() => setAttributes({ nameColor: undefined })}
                        onSelect={() => {}}
                    >
                        <PanelColorControl
                            label={__('Colors', 'insignia')}
                            colorSettings={[
                                {
                                    value: nameColor,
                                    onChange: color => setAttributes({ nameColor: color }),
                                    label: __('Name', 'insignia')
                                },
                                {
                                    value: designationColor,
                                    onChange: color => setAttributes({ designationColor: color }),
                                    label: __('Designation', 'insignia')
                                },
                                {
                                    value: iconColor,
                                    onChange: color => setAttributes({ iconColor: color }),
                                    label: __('Icon', 'insignia')
                                },
                                {
                                    value: overlayColor,
                                    onChange: color => setAttributes({ overlayColor: color }),
                                    label: __('Overlay', 'insignia')
                                }
                            ]}
                        />
                    </ToolsPanelItem>
                </ToolsPanel>

                <ToolsPanel
                    label={__('Icons & Hover', 'insignia')}
                    resetAll={() => setAttributes({ iconColor: undefined, overlayColor: undefined })}
                >
                    <ToolsPanelItem
                        hasValue={() => !!iconColor}
                        label={__('Icon Color', 'insignia')}
                        onDeselect={() => setAttributes({ iconColor: undefined })}
                        onSelect={() => {}}
                    >
                        <PanelColorControl
                            label={__('Icon Color', 'insignia')}
                            colorSettings={[
                                {
                                    value: iconColor,
                                    onChange: color => setAttributes({ iconColor: color }),
                                    label: __('Color', 'insignia')
                                }
                            ]}
                        />
                    </ToolsPanelItem>

                    <ToolsPanelItem
                        hasValue={() => !!overlayColor}
                        label={__('Hover Overlay', 'insignia')}
                        onDeselect={() => setAttributes({ overlayColor: undefined })}
                        onSelect={() => {}}
                    >
                        <PanelColorControl
                            label={__('Overlay Color', 'insignia')}
                            colorSettings={[
                                {
                                    value: overlayColor,
                                    onChange: color => setAttributes({ overlayColor: color }),
                                    label: __('Overlay', 'insignia')
                                }
                            ]}
                        />
                    </ToolsPanelItem>
                </ToolsPanel>
            </InspectorControls>
        </>
    );
}

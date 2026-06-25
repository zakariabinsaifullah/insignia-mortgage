import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    __experimentalBorderBoxControl as BorderBoxControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalToolsPanel as ToolsPanel, // eslint-disable-line
    __experimentalToolsPanelItem as ToolsPanelItem // eslint-disable-line
} from '@wordpress/components';

import {
    NativeToggleGroupControl,
    NativeRangeControl,
    NativeToggleControl,
    PanelColorControl,
    NativeSelectControl,
    NativeResponsiveControl,
    NativeUnitControl,
    NativeIconPicker,
    NativeBoxControl,
    NativeBorderBoxControl
} from '../../components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const {
        resMode,
        heightType,
        heights,
        columns,
        gaps,
        autoplay,
        columnOnMobile,
        loop,
        showArrows,
        navType,
        showPagination,
        pnSize,
        paSize,
        pRadius,
        paRadius,
        pgap,
        paginationColor,
        npaginationHeight,
        apaginationHeight,
        delay,
        navColor,
        navbgColor,
        navBorderColor,
        navSize,
        navIconSize,
        navBorderRadius,
        navPadding,
        navBorder,
        navEdgeGap,
        navPosition,
        prevIconName,
        prevIconType,
        prevCustomSvg,
        nextIconName,
        nextIconType,
        nextCustomSvg
    } = attributes;

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={ __( 'General', 'insignia' ) } initialOpen={ true }>
                    <NativeToggleGroupControl
                        label={ __( 'Height Type', 'insignia' ) }
                        value={ heightType }
                        onChange={ value => setAttributes( { heightType: value } ) }
                        options={ [
                            { label: __( 'Adaptive', 'insignia' ), value: 'adaptive' },
                            { label: __( 'Fixed', 'insignia' ), value: 'fixed' }
                        ] }
                    />
                    { heightType === 'fixed' && (
                        <NativeResponsiveControl label={ __( 'Height', 'insignia' ) } props={ props }>
                            <NativeUnitControl
                                label={ __( 'Slider Height', 'insignia' ) }
                                value={ heights[ resMode ] }
                                onChange={ value => {
                                    const newHeights = { ...heights, [ resMode ]: value };
                                    setAttributes( { heights: newHeights } );
                                } }
                            />
                        </NativeResponsiveControl>
                    ) }
                </PanelBody>
                <PanelBody title={ __( 'Slider Options', 'insignia' ) } initialOpen={ false }>
                    <NativeResponsiveControl label={ __( 'Columns', 'insignia' ) } props={ props }>
                        <NativeRangeControl
                            value={ columns[ resMode ] }
                            onChange={ value => {
                                const newColumns = { ...columns, [ resMode ]: value };
                                setAttributes( { columns: newColumns } );
                            } }
                            min={ 1 }
                            max={ 6 }
                            step={ 1 }
                        />
                    </NativeResponsiveControl>
                    <NativeResponsiveControl label={ __( 'Gaps', 'insignia' ) } props={ props }>
                        <NativeRangeControl
                            value={ gaps[ resMode ] }
                            onChange={ value => {
                                const newGaps = { ...gaps, [ resMode ]: value };
                                setAttributes( { gaps: newGaps } );
                            } }
                            min={ 0 }
                            max={ 100 }
                            step={ 1 }
                        />
                    </NativeResponsiveControl>
                    <NativeToggleControl
                        label={ __( 'Column on mobile', 'insignia' ) }
                        checked={ columnOnMobile }
                        onChange={ value => setAttributes( { columnOnMobile: value } ) }
                    />
                    <NativeToggleControl
                        label={ __( 'Loop', 'insignia' ) }
                        checked={ loop }
                        onChange={ value => setAttributes( { loop: value } ) }
                    />
                    <NativeToggleControl
                        label={ __( 'Autoplay', 'insignia' ) }
                        checked={ autoplay }
                        onChange={ value => setAttributes( { autoplay: value } ) }
                    />
                    { autoplay && (
                        <NativeRangeControl
                            label={ __( 'Delay (ms)', 'insignia' ) }
                            value={ delay }
                            onChange={ value => setAttributes( { delay: value } ) }
                            min={ 1000 }
                            max={ 10000 }
                            step={ 500 }
                        />
                    ) }
                    <NativeToggleControl
                        label={ __( 'Show Arrows', 'insignia' ) }
                        checked={ showArrows }
                        onChange={ value => setAttributes( { showArrows: value } ) }
                    />
                    <NativeToggleControl
                        label={ __( 'Show Pagination', 'insignia' ) }
                        checked={ showPagination }
                        onChange={ value => setAttributes( { showPagination: value } ) }
                    />
                    { showArrows && (
                        <NativeToggleGroupControl
                            label={ __( 'Navigation Type', 'insignia' ) }
                            value={ navType }
                            onChange={ value => setAttributes( { navType: value } ) }
                            options={ [
                                { label: __( 'Inside', 'insignia' ), value: 'inside' },
                                { label: __( 'Outside', 'insignia' ), value: 'outside' }
                            ] }
                        />
                    ) }
                    { showArrows && (
                        <NativeSelectControl
                            label={ __( 'Navigation Position', 'insignia' ) }
                            value={ navPosition }
                            onChange={ value => setAttributes( { navPosition: value } ) }
                            options={ [
                                { label: __( 'Middle', 'insignia' ), value: 'middle' },
                                { label: __( 'Top Left', 'insignia' ), value: 'top-left' },
                                { label: __( 'Top Right', 'insignia' ), value: 'top-right' },
                                { label: __( 'Bottom Left', 'insignia' ), value: 'bottom-left' },
                                { label: __( 'Bottom Right', 'insignia' ), value: 'bottom-right' },
                                { label: __( 'Bottom Split', 'insignia' ), value: 'bottom-split' }
                            ] }
                        />
                    ) }
                    { showArrows && (
                        <>
                            <NativeIconPicker
                                label={ __( 'Previous Icon', 'insignia' ) }
                                onIconSelect={ ( iconName, iconType ) => {
                                    setAttributes( {
                                        prevIconName: iconName,
                                        prevIconType: iconType,
                                        prevCustomSvg: undefined
                                    } );
                                } }
                                onCustomSvgInsert={ ( { customSvgCode, iconType } ) => {
                                    setAttributes( {
                                        prevCustomSvg: customSvgCode,
                                        prevIconType: iconType
                                    } );
                                } }
                                iconName={ prevIconName }
                                customSvgCode={ prevCustomSvg }
                            />
                            <NativeIconPicker
                                label={ __( 'Next Icon', 'insignia' ) }
                                onIconSelect={ ( iconName, iconType ) => {
                                    setAttributes( {
                                        nextIconName: iconName,
                                        nextIconType: iconType,
                                        nextCustomSvg: undefined
                                    } );
                                } }
                                onCustomSvgInsert={ ( { customSvgCode, iconType } ) => {
                                    setAttributes( {
                                        nextCustomSvg: customSvgCode,
                                        nextIconType: iconType
                                    } );
                                } }
                                iconName={ nextIconName }
                                customSvgCode={ nextCustomSvg }
                            />
                        </>
                    ) }
                </PanelBody>
            </InspectorControls>
            <InspectorControls group="styles">
                { showPagination && (
                    <ToolsPanel
                        label={ __( 'Pagination', 'insignia' ) }
                        resetAll={ () =>
                            setAttributes( {
                                pnSize: undefined,
                                paSize: undefined,
                                pRadius: undefined,
                                paRadius: undefined,
                                paginationColor: undefined,
                                pgap: undefined,
                                npaginationHeight: undefined,
                                apaginationHeight: undefined
                            } )
                        }
                    >
                        <ToolsPanelItem
                            hasValue={ () => !! pgap }
                            label={ __( 'Gap', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    pgap: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeUnitControl
                                label={ __( 'Vertical Gap', 'insignia' ) }
                                value={ pgap }
                                onChange={ value => setAttributes( { pgap: value } ) }
                            />
                        </ToolsPanelItem>
                        <ToolsPanelItem
                            hasValue={ () => !! pnSize || !! paSize }
                            label={ __( 'Sizes', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    pnSize: undefined,
                                    paSize: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeUnitControl
                                label={ __( 'Normal Size', 'insignia' ) }
                                value={ pnSize }
                                onChange={ value => setAttributes( { pnSize: value } ) }
                            />
                            <NativeUnitControl
                                label={ __( 'Active Size', 'insignia' ) }
                                value={ paSize }
                                onChange={ value => setAttributes( { paSize: value } ) }
                            />
                        </ToolsPanelItem>
                        <ToolsPanelItem
                            hasValue={ () => !! npaginationHeight }
                            label={ __( 'Height', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    npaginationHeight: undefined,
                                    apaginationHeight: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeUnitControl
                                label={ __( 'Normal Height', 'insignia' ) }
                                value={ npaginationHeight }
                                onChange={ value => setAttributes( { npaginationHeight: value } ) }
                            />
                            <NativeUnitControl
                                label={ __( 'Active Height', 'insignia' ) }
                                value={ apaginationHeight }
                                onChange={ value => setAttributes( { apaginationHeight: value } ) }
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            hasValue={ () => !! pRadius || !! paRadius }
                            label={ __( 'Radius', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    pRadius: undefined,
                                    paRadius: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeUnitControl
                                label={ __( 'Normal Radius', 'insignia' ) }
                                value={ pRadius }
                                onChange={ value => setAttributes( { pRadius: value } ) }
                            />
                            <NativeUnitControl
                                label={ __( 'Active Radius', 'insignia' ) }
                                value={ paRadius }
                                onChange={ value => setAttributes( { paRadius: value } ) }
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            hasValue={ () => !! paginationColor }
                            label={ __( 'Color', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    paginationColor: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <PanelColorControl
                                label={ __( 'Color', 'insignia' ) }
                                colorSettings={ [
                                    {
                                        value: paginationColor,
                                        onChange: color => setAttributes( { paginationColor: color } )
                                    }
                                ] }
                            />
                        </ToolsPanelItem>
                    </ToolsPanel>
                ) }
                { showArrows && (
                    <ToolsPanel
                        label={ __( 'Navigation', 'insignia' ) }
                        resetAll={ () =>
                            setAttributes( {
                                navbgColor: undefined,
                                navColor: undefined,
                                navEdgeGap: undefined,
                                navSize: undefined,
                                navIconSize: undefined,
                                navBorderColor: undefined,
                                navBorderRadius: undefined,
                                navPadding: undefined,
                                navBorder: undefined
                            } )
                        }
                    >
                        <ToolsPanelItem
                            hasValue={ () => !! navEdgeGap }
                            label={ __( 'Edge Gap', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    navEdgeGap: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeUnitControl
                                label={ __( 'Edge Gap', 'insignia' ) }
                                value={ navEdgeGap }
                                onChange={ value => setAttributes( { navEdgeGap: value } ) }
                            />
                        </ToolsPanelItem>
                        <ToolsPanelItem
                            hasValue={ () => !! navSize }
                            label={ __( 'Size', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    navSize: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeUnitControl
                                label={ __( 'Size', 'insignia' ) }
                                value={ navSize }
                                onChange={ value => setAttributes( { navSize: value } ) }
                            />
                        </ToolsPanelItem>
                        <ToolsPanelItem
                            hasValue={ () => !! navIconSize }
                            label={ __( 'Icon Size', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    navIconSize: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeUnitControl
                                label={ __( 'Icon Size', 'insignia' ) }
                                value={ navIconSize }
                                onChange={ value => setAttributes( { navIconSize: value } ) }
                            />
                        </ToolsPanelItem>
                        <ToolsPanelItem
                            hasValue={ () => !! navColor || !! navbgColor || !! navBorderColor }
                            label={ __( 'Colors', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    navColor: undefined,
                                    navbgColor: undefined,
                                    navBorderColor: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <PanelColorControl
                                label={ __( 'Colors', 'insignia' ) }
                                colorSettings={ [
                                    {
                                        label: __( 'Color', 'insignia' ),
                                        value: navColor,
                                        onChange: color => setAttributes( { navColor: color } )
                                    },
                                    {
                                        label: __( 'Background', 'insignia' ),
                                        value: navbgColor,
                                        onChange: color => setAttributes( { navbgColor: color } )
                                    }
                                ] }
                            />
                        </ToolsPanelItem>
                        <ToolsPanelItem
                            hasValue={ () => !! navBorder }
                            label={ __( 'Border', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    navBorder: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeBorderBoxControl
                                label={ __( 'Border', 'insignia' ) }
                                value={ navBorder }
                                onChange={ value => setAttributes( { navBorder: value } ) }
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            hasValue={ () => !! navBorderRadius }
                            label={ __( 'Radius', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    navBorderRadius: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeBoxControl
                                label={ __( 'Radius', 'insignia' ) }
                                value={ navBorderRadius }
                                onChange={ value => setAttributes( { navBorderRadius: value } ) }
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            hasValue={ () => !! navPadding }
                            label={ __( 'Padding', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    navPadding: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeBoxControl
                                label={ __( 'Padding', 'insignia' ) }
                                value={ navPadding }
                                onChange={ value => setAttributes( { navPadding: value } ) }
                            />
                        </ToolsPanelItem>
                    </ToolsPanel>
                ) }
            </InspectorControls>
        </>
    );
};

export default Inspector;

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
// import { RangeControl, SelectControl } from "@wordpress/components";
import { NativeRangeControl, NativeSelectControl } from '../../../components';

const HoverTransitionControls = ( { attributes, setAttributes } ) => {
	const {
		hoverTransitionDuration,
		hoverTransitionTiming,
		hoverTextColor,
		hoverBackgroundColor,
		hoverBackgroundGradient,
		hoverBorderColor,
		customHoverTextColor,
		customHoverBackgroundColor,
		customHoverBorderColor,
	} = attributes;

	const hasHoverColor =
		customHoverBorderColor ||
		customHoverTextColor ||
		customHoverBackgroundColor ||
		hoverTextColor ||
		hoverBackgroundColor ||
		hoverBackgroundGradient ||
		hoverBorderColor;

	if ( ! hasHoverColor ) {
		return null;
	}

	const timingOptions = [
		{ label: __( "Ease", "gl-layout-builder" ), value: "ease" },
		{ label: __( "Linear", "gl-layout-builder" ), value: "linear" },
		{ label: __( "Ease In", "gl-layout-builder" ), value: "ease-in" },
		{ label: __( "Ease Out", "gl-layout-builder" ), value: "ease-out" },
		{ label: __( "Ease In Out", "gl-layout-builder" ), value: "ease-in-out" },
	];

	return (
		<div
			className="gllb-hover-color__transition-controls"
			style={ {
				gridTemplateColumns: "repeat(2, minmax(0px, 1fr))",
				gap: "calc(16px)",
				gridColumn: "1 / -1",
			} }
		>
			<NativeRangeControl
				label={ __( "Transition Duration", "gl-layout-builder" ) }
				value={ hoverTransitionDuration }
				onChange={ ( value ) =>
					setAttributes( { hoverTransitionDuration: value } )
				}
				min={ 0 }
				max={ 2000 }
				step={ 50 }
				resetFallbackValue={ 200 }
				help={ __( "Duration in milliseconds", "gl-layout-builder" ) }
			/>
			<NativeSelectControl
				label={ __( "Timing Function", "gl-layout-builder" ) }
				value={ hoverTransitionTiming }
				options={ timingOptions }
				onChange={ ( value ) =>
					setAttributes( { hoverTransitionTiming: value } )
				}
			/>
		</div>
	);
};

export default HoverTransitionControls;

import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import Inspector from './inspector';
import './editor.scss';

export default function Edit(props) {
    const { attributes } = props;
    const { columns, gaps } = attributes;
    const blockProps = useBlockProps({
        className: `columns-${columns?.Desktop} gap-${gaps?.Desktop}`
    });

    return (
        <>
            <Inspector {...props} />
            <div {...blockProps}>
                <ServerSideRender block="insignia/team-carousel" attributes={props.attributes} />
            </div>
        </>
    );
}

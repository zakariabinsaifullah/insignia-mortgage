import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import Inspector from './inspector';
import './editor.scss';

export default function Edit( props ) {
    const blockProps = useBlockProps();

    return (
        <>
            <Inspector { ...props } />
            <div { ...blockProps }>
                <ServerSideRender block="insignia/team-grid" attributes={ props.attributes } />
            </div>
        </>
    );
}

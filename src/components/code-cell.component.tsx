import { useState, useEffect } from 'react';

import customBundler from '../bundler';

import CodeEditor from './code-editor';
import PreviewBox from './preview-box';
import Resizable from './resizable';
import './code-cell.styles.css';

const CodeCell = () => {
  const [outputCode, setOutputCode] = useState('');
  const [err, setErr] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output: any = await customBundler(inputValue);
      setOutputCode(output.code);
      setErr(output.err);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  return (
    <Resizable direction='vertical'>
      <div className='code-and-frame-wrapper'>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue='"Hi there!"'
            onChange={(value: string) => setInputValue(value)}
          />
        </Resizable>
        <PreviewBox code={outputCode} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;

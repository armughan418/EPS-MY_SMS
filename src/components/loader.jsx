const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="relative w-10 h-10 text-white animate-[bblFadInOut_1.8s_infinite_ease-in-out] before:content-[''] before:absolute before:top-0 before:left-[-1.75rem] before:w-10 before:h-10 before:rounded-full before:animate-[bblFadInOut_1.8s_infinite_ease-in-out] before:animate-delay-[-0.32s] after:content-[''] after:absolute after:top-0 after:left-[1.75rem] after:w-10 after:h-10 after:rounded-full after:animate-[bblFadInOut_1.8s_infinite_ease-in-out] after:animate-delay-[-0.16s] bg-white rounded-full"></div>
            <style>
                {`
            @keyframes bblFadInOut {
              0%, 80%, 100% { box-shadow: 0 2.5em 0 -1.3em }
              40% { box-shadow: 0 2.5em 0 0 }
            }
          `}
            </style>
        </div>
    );
};

export default Loader;

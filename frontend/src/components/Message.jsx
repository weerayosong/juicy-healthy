const Message = ({
    variant = 'bg-red-100 text-red-700 border-red-400',
    children,
}) => {
    return (
        <div className={`px-4 py-3 rounded-sm border ${variant} my-4`}>
            {children}
        </div>
    )
}

export default Message


import React, { useState } from "react";
import { Button, Skeleton, Space } from "antd";
import { useEffect, useRef } from "react"
import { BsGearFill, BsX, } from "react-icons/bs"

const NotificationDropDown = ({ onClose }) => {

  const modalRef = useRef(null)

  const [loading, setLoading] = useState(true);


  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open])

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose(false)
    }
  }

  return (
    <>
      {/* Modal */}

      <div
        className="absolute top-8 right-0 z-50 flex items-center justify-center w-96"
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className="bg-[var(--background)] rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-[var(--background)] sticky top-0 z-10 w-full">
            <h1 className="text-xl font-semibold">Notifications</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md transition-colors">
                <BsGearFill className="h-5 w-5" />
              </button>
              <button className="px-3 py-1 text-sm border border-[var(--secondary)] rounded-md transition-colors">
                New
              </button>
              <button
                onClick={() => onClose(false)}
                className="p-2 rounded-md transition-colors cursor-pointer"
              >
                <BsX className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/*sceleton  */}
          <Space
            className="h-[450px] px-4 py-6"
            direction="vertical"
            style={{ width: "100%", backgroundColor: "var(--secondary)" }}
            size={16}
          >
            <Skeleton loading={loading}></Skeleton>
            <Skeleton loading={loading}></Skeleton>
            <Skeleton loading={loading}></Skeleton>
          </Space>
        </div>
      </div>
    </>
  );
}

export default NotificationDropDown
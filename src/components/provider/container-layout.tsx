import React from "react";

const ContainerLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="">
			<div className="container border-x mx-auto max-w-lg">{children}</div>
		</div>
	);
};

export default ContainerLayout;

function PermissionDenied() {
  return (
    <div>
      <div className="text-red-500 text-sm text-center">Permission Denied</div>
      <div className="text-blue-500 text-sm text-center">
        Only Employers Allowed to Post Jobs, If you would like to hire students
        to collaborate, use the Jobs group
      </div>
    </div>
  );
}

export default PermissionDenied;
